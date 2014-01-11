<?php

namespace monad\admin;
use monolyth;

trait Language_Access
{
    use monolyth\Language_Access {
        monolyth\Language_Access::language as projectlanguage;
    }

    public static function language()
    {
        static $language;
        if (!isset($language)) {
            $language = Language_Model::instance();
        }
        return $language;
    }
}

