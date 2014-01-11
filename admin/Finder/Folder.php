<?php

namespace monad\admin;
use monolyth\Finder;
use monolyth\adapter\sql\NoResults_Exception;
use Adapter_Access;

class Folder_Finder implements Finder
{
    use Adapter_Access;

    public function all()
    {
        try {
            $folders = [];
            $q = self::adapter()->rows(
                'monolyth_folder',
                ['*', 'NULL AS children'],
                [],
                ['order' => 'LOWER(name) ASC']
            );
            $res = null;
            foreach ($q as $i => $row) {
                if (!$row['parent']) {
                    $folders[$row['id']] = $row;
                    unset($q[$i]);
                }
            }
            while ($q) {
                foreach ($q as $i => $row) {
                    if ($this->traverse($folders, $row['parent'], $row)) {
                        unset($q[$i]);
                    }
                }
            }
            return $folders;
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    private function traverse(&$folders, $search, $row)
    {
        if (isset($folders[$search])) {
            if (!isset($folders[$search]['children'])) {
                $folders[$search]['children'] = [];
            }
            $folders[$search]['children'][$row['id']] = $row;
            return true;
        }
        foreach ($folders as &$subs) {
            if (isset($subs['children'])) {
                if ($this->traverse($subs['children'], $search, $row)) {
                    return true;
                }
            }
        }
        return false;
    }
}

