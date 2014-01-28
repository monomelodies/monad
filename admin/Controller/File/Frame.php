<?php

namespace monad\admin;
use monad\core;
use monolyth\render\form\File;
use monolyth\render\Translate_Parser;
use ErrorException;

class Frame_File_Controller extends core\Controller
{
    protected function get(array $args)
    {
        $this->template = $this->view('monolyth\template/page');
        $this->translate = new Translate_Parser;
        extract($args);
        $media = null;
        if ($id and !($media = Media_Finder::instance()->find($id))) {
            throw new HTTP404_Exception;
        }
        $input = new File;
        $input->prepare('file');
        $parse = true;
        return $this->view(
            'template/file/frame',
            compact('media', 'input', 'parse')
        );
    }
}

