<?php

namespace monad;

trait Section_Access
{
    public static function sections()
    {
        static $sections;
        if (!isset($sections)) {
            $sections = Section_Finder::instance();
        }
        return $sections;
    }
}

