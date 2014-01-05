<?php

namespace monad;

trait Page_Access
{
    public static function pages()
    {
        static $pages;
        if (!isset($pages)) {
            $pages = new Page_Finder;
        }
        return $pages;
    }
}

