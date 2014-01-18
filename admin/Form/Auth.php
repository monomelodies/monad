<?php

namespace monad\admin;
use monad\core\Form;

class Auth_Form extends Form
{
    public function __construct($id = null)
    {
        parent::__construct($id);
        return parent::prepare($id);
    }
}

