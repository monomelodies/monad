<?php

namespace monad\admin;

trait Media_Access
{
    public static function medias()
    {
        static $medias;
        if (!isset($medias)) {
            $medias = new Media_Finder;
        }
        return $medias;
    }
}

