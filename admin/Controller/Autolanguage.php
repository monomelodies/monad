<?php

namespace monad\admin;
use monad\core\Controller;
use monolyth\core;
use monolyth\Language_Model;

class Autolanguage_Controller extends Controller
implements core\Autolanguage_Controller
{
    use core\Autolanguage;

    protected function guessLanguage(Language_Model $languages = null)
    {
        return $this->_guessLanguage($this->language);
    }

    protected function get(array $args)
    {
        return $this->_get(['format' => $this->url(
            'monad/admin',
            ['language' => '%s']
        )]);
    }
}

