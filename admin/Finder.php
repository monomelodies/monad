<?php

namespace monad\admin;
use monolyth;
use monolyth\adapter;
use monolyth\Language_Access;
use monolyth\User_Access;
use monolyth\adapter\sql\NoResults_Exception;

class Finder
implements monolyth\Finder, adapter\Access, Language_Access, User_Access
{
    public function find()
    {
        try {
            $q = $this->adapter->row(
                'monad_admin JOIN monad_admin_i18n USING(id)',
                '*',
                ['language' => $this->language->current->id]
            );
            $q2 = $this->adapter->rows(
                'monad_admin_item m
                 JOIN monad_admin_item_i18n i USING(id)
                 JOIN monolyth_language_all l ON l.id = i.language',
                [
                    'm.*',
                    'i.*',
                    'l.code AS language',
                    'CONCAT(\'{
                        "package":"\', package, \'",
                        "target":"\', target, \'"
                    }\') AS params',
                ],
                [
                    'admin' => $q['id'],
                    'i.language' => $this->language->current->id,
                ],
                ['order' => 'm.sortorder']
            );
            $items = [];
            $parents = [];
            foreach ($q2 as $row) {
                $acl = $this->user->acl;
                if (!$row['parent']
                    || $acl->using("{$row['package']}.{$row['target']}")
                           ->can($acl::READ)
                ) {
                    if ($row['parent']) {
                        if (!isset($parents[$row['parent']])) {
                            $parents[$row['parent']] = [];
                        }
                        $parents[$row['parent']][] = $row['id'];
                    }
                    $items["{$row['id']} {$row['title']}"] = $row;
                }
            }
            // Remove empty sections.
            foreach ($items as $key => $value) {
                if ($value['parent']) {
                    continue;
                }
                $id = substr($key, 0, strpos($key, ' '));
                if (!(isset($parents[$id]) && $parents[$id])) {
                    unset($items[$key]);
                }
            }
            $self = $this;
            $menu = clone $this->_menu;
            return $menu->build($items);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

