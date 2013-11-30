<?php

namespace monad;
use monolyth;

class User_Model extends monolyth\User_Model
{
    public function loggedIn()
    {
        return parent::loggedIn() && $this->isAdmin('monad');
    }

    public function isAdmin($name)
    {
        $acl = $this->acl;
        return $acl->using($name)->can($acl::READ);
    }
}

