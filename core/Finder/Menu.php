<?php

namespace monad\core;
use monolyth\Finder;

class Menu_Finder implements Finder
{
    public function find()
    {
        $menu = new Menu_Model;
        try {
            return $menu->init('admin/config/menu.php');
        } catch (MenuNotFound_Exception $e) {
            return null;
        }
    }
}

