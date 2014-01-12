<?php

namespace monad\core;
use monolyth\User_Access;

trait Permission
{
    use User_Access;

    public function hasPermission($actions = [])
    {
        if (isset($this->requires['group'])
            && $this->requires['group']
            && !self::user()->inGroup($this->requires['group'])
        ) {
            return false;
        }
        if (!isset($group, $actions)) {
            return true;
        }
        return true;
    }
}

