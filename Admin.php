<?php

namespace monad;

abstract class Admin
{
    private static $menu = array();

    public function register($model, $admin = null)
    {
        $ns = substr($model, 0, strrpos($model, '\\'));
        if (!isset(self::$menu[$ns])) {
            self::$menu[$ns] = array();
        }
        self::$menu[$ns][] = array($model, $admin);
    }

    public function getMenu()
    {
        return self::$menu;
    }
}

