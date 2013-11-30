<?php

namespace monad\admin;

class View_File_Controller extends Controller
{
    protected function get(array $args)
    {
        $this->template = false;
        extract($args);
        if (!($media = $this->medias->find($id))) {
            throw new HTTP404_Exception;
        }
        return $this->view('template/file/view', compact('media'));
    }
}

