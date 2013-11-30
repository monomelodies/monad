<?php

namespace monad\admin;
use monad\core\Controller as Base;
use monolyth\core\HTTPError;

class HTTP404_Controller extends Base implements HTTPError, Login_Required
{
    protected function get()
    {
        header("HTTP/1.1 404 File not found", true, 404);
        header("Content-type: text/html", true); // might have been overridden
        return $this->view('monad\admin\page/404');
    }
}

