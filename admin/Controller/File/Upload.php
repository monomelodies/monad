<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;
use ErrorException;
use monad\core\Controller;

class Upload_File_Controller extends Controller
{
    protected function post(array $args)
    {
        if (!isset($_FILES['file'])) {
            throw new HTTP301_Exception($this->http->getRedir());
        }
        if ($error = $this->media->create(
            $_FILES['file'],
            isset($_GET['id']) ? $_GET['id'] : null
        )) {
            var_dump($error);
        }
        $media = $this->media;
        $this->template = null;
        return $this->view('template/file/done', compact('media'));
    }
}

