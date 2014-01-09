<?php

namespace monad\admin;
use monolyth\core;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\User_Access;

class Folder_Model extends core\Model implements User_Access
{
    public function create($name, $parent = null)
    {
        try {
            self::adapter()->insert(
                'monolyth_folder',
                compact('name', 'parent') + ['owner' => self::user()->id()]
            );
        } catch (InsertNone_Exception $e) {
        }
    }
}

