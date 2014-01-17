<?php

namespace monad\admin;
use monolyth\Ajax_Required;

class ForeignKey_Controller extends Controller
implements Ajax_Required, Login_Required
{
    protected function get(array $args)
    {
        echo '1';
        die();
    }
}

