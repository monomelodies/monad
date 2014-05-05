<?php

namespace monad\admin;
use monad\core\Controller;

class Reorder_Controller extends Controller implements Login_Required
{
    protected function post(array $args)
    { 
        if (!isset($_POST['id'], $_POST['move'], $_POST['menu'])) {
            die("1");
        }
        if ($error = $this->sort->reorder(
            $_POST['id'], $_POST['move'], $_POST['menu'], $_POST['parent'] 
        )) {
            die("1");
        }
        die("0");
    }
}
