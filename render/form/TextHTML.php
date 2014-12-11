<?php

namespace monad\render\form;
use monolyth\render\form;
use monad\admin\Media_Parser;

class TextHTML extends form\TextHTML
{
    public $parser;

    public function __construct()
    {
        $this->parser = new Media_Parser;
    }
}

