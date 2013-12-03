<?php

namespace monad\core;
use monolyth;
use monad\Controller;

class Autolanguage_Controller extends Controller
{
    protected function get(array $args)
    {
        throw new monolyth\HTTP301_Exception(url(
            'monad',
            array('language' => $this->guessLanguage())
        ));
    }
}

