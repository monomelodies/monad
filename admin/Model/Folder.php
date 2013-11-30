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
            $this->adapter->insert(
                'monolyth_folder',
                compact('name', 'parent') + ['owner' => $this->user->id()]
            );
        } catch (InsertNone_Exception $e) {
        }
    }
}

