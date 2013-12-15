<?php

namespace monad\admin;
use monad\core;

class Frame_File_Controller extends core\Controller
{
    protected function get(array $args)
    {
        $this->template = $this->view('monolyth\template/page');
        extract($args);
        $media = null;
        if ($id and !($media = $this->medias->find($id))) {
            throw new HTTP404_Exception;
        }
        $this->input->prepare('file');
        return $this->view('template/file/frame', compact('media'));
    }
}

