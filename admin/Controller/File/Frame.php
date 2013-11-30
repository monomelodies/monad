<?php

namespace monad\admin;

class Frame_File_Controller extends Controller
{
    protected function get(array $args)
    {
        $this->template = false;
        extract($args);
        $media = null;
        if ($id and !($media = $this->medias->find($id))) {
            throw new HTTP404_Exception;
        }
        $this->input->prepare('file');
        return $this->view(
            ['template/file/frame', 'monolyth\template/page'],
            compact('media')
        );
    }
}

