<?php

namespace monad\admin;
use monad\core\Form;

class User_Form extends Form
{
    public function __construct($id = null)
    {
        parent::__construct($id);
        $this->addText('name', $this->text('./name'))
             ->maxLength(64)
             ->isRequired();
        $this->addEmail('email', $this->text('./email'))
             ->maxLength(255)
             ->isRequired();
        $this->addPassword('pass', $this->text('./pass'))
             ->maxLength(255)
             ->isRequired();
        return parent::prepare($id);
    }
}

