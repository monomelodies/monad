<?php

namespace monad\admin;
use monad\Menu_Model as Base;
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\Language_Access;
use monolyth\User_Access;

class Menu_Model extends core\Model implements Language_Access, User_Access
{
    const STATUS_MAIN = Base::STATUS_MAIN;

    public $requires = [
        'monad_menu',
        'monad_menu_i18n',
        'monad_menu_item',
        'monad_menu_item_i18n',
    ];
    public static $allowed = [
        'status' => [
            self::STATUS_MAIN => 'main',
        ],
    ];

    public function inlines()
    {
        return ['items'];
    }

    public function keys()
    {
        return ['id'];
    }

    public function save(Form $form)
    {
        $id = $this['id'];
        $menu = [];
        $i18n = [];
        foreach ($form as $name => $value) {
            if (preg_match("@^(\w+)\[(\d+)\]$@", $name, $match)) {
                if (!isset($i18n[$match[2]])) {
                    $i18n[$match[2]] = [];
                }
                $i18n[$match[2]][$match[1]] = $value->value;
            } else {
                $menu[$name] = $value->value;
            }
        }
        $changed = 0;
        $this->adapter->beginTransaction();
        if ($menu) {
            try {
                $this->adapter->update('monad_menu', $menu, compact('id'));
                ++$changed;
                $this->adapter->update(
                    'monad_menu',
                    ['usermodified' => [$this->user->id()]],
                    compact('id')
                );
            } catch (UpdateNone_Exception $e) {
            }
        }
        foreach ($i18n as $language => $data) {
            if (!$data) {
                continue;
            }
            try {
                $this->adapter->update(
                    'monad_menu_i18n',
                    $data,
                    compact('id', 'language')
                );
                ++$changed;
                $this->adapter->update(
                    'monad_menu',
                    ['usermodified' => [$this->user->id()]],
                    compact('id')
                );
            } catch (UpdateNone_Exception $e) {
            }
        }
        if ($order = json_decode($form['sort[menu_item]']->value)) {
            foreach ($order as $row) {
                try {
                    $this->adapter->update(
                        'monad_menu_item',
                        ['sortorder' => $row[1]],
                        ['id' => $row[0]]
                    );
                    ++$changed;
                    $this->adapter->update(
                        'monad_menu_item',
                        [
                            'usermodified' => [$this->user->id()],
                            'datemodified' => $this->adapter->now(),
                        ],
                        ['id' => $row[0]]
                    );
                } catch (UpdateNone_Exception $e) {
                }
            }
        }
        $this->adapter->commit();
        return $changed ? null : 'nochange';
    }

    public function delete()
    {
        try {
            $this->adapter->delete('monad_menu', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'database';
        }
    }
}

