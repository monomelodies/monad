<?php

namespace monad;
use monolyth;

class Language_Model extends monolyth\Language_Model
{
    public function __construct()
    {
        $this->_new = false;
        parent::build([
            [
                'id' => 1,
                'code' => 'en',
                'lc_code' => 'en_US',
                'title' => 'English',
                'is_default' => true,
                'sortorder' => 1,
                'fallback' => null,
            ],
            [
                'id' => 2,
                'code' => 'nl',
                'lc_code' => 'nl_NL',
                'title' => 'Nederlands',
                'is_default' => false,
                'sortorder' => 2,
                'fallback' => 1,
            ],
        ]);
    }
}

