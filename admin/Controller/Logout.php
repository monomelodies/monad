<?php

namespace monad\admin;
use monolyth;

class Logout_Controller extends Controller
{
    public function get()
    {
        call_user_func($this->logout);
        throw new monolyth\HTTP301_Exception($this->url(
            'monad/admin/login',
            array('language' => $this->language->current->code)
        ));
    }
}

