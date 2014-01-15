<?php

namespace monad;

trait Menu_Access
{
    public static function menus()
    {
        static $menus;
        if (!isset($menus)) {
            $menus = Menu_Finder::instance();
        }
        return $menus;
    }
}

