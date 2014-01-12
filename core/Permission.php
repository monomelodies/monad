<?php

namespace monad\core;
use monolyth\User_Access;

trait Permission
{
    use User_Access;

    public function hasPermission($actions = [])
    {
        if (!$this->requires) {
            return true;
        }
        foreach (array_keys($this->requires) as $group) {
            if (self::user()->inGroup($group)) {
                return true;
            }
        }
        return false;
    }
}

