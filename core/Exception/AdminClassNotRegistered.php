<?php

namespace monad\core;

class AdminClassNotRegistered_Exception extends Exception
{
    public function __construct($name)
    {
        $this->message = $name;
    }
}

