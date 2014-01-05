<?php

namespace monad\admin;
use monolyth\account\Logout_Model;
use monolyth\HTTP301_Exception;

class Logout_Controller extends Controller
{
    public function get()
    {
        $logout = new Logout_Model;
        $logout();
        throw new HTTP301_Exception($this->url(
            'monad/admin/login',
            ['language' => self::language()->current->code]
        ));
    }
}

