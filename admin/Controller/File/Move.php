<?php

namespace monad\admin;
use monad\core\Controller;
use monolyth\Ajax_Required;

class Move_File_Controller extends Controller
implements Ajax_Required, Login_Required
{
    protected function post(array $args)
    {
        if (!isset($_POST['folder'], $_POST['file'])) {
            die("1");
        }
        if (!$_POST['folder']) {
            $_POST['folder'] = null;
        }
        if ($error = $this->media->move($_POST['file'], $_POST['folder'])) {
            die("1");
        }
        die("0");
    }
}

