<?php

namespace monad\admin;
use monolyth;
use monolyth\HTTP301_Exception;

class Redirect_Controller extends monolyth\Controller
{
    protected function get(array $args)
    {
        throw new HTTP301_Exception($_GET['pick']);
    }
}

