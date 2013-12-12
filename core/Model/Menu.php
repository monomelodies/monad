<?php

namespace monad\core;
use ErrorException;

class Menu_Model
{
    public function init($file)
    {
        try {
            include $file;
        } catch (ErrorException $e) {
            throw new MenuNotFound_Exception;
        }
    }
}

