<?php

namespace monad;
use monolyth;

class User_Model extends monolyth\User_Model
{
    public function loggedIn()
    {
        return parent::loggedIn() && $this->inGroup('Monad');
    }
}

