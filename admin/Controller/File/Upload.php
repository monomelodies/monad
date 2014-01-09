<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;
use ErrorException;
use monad\core\Controller;
use monolyth\Media_Model;

class Upload_File_Controller extends Controller
{
    protected function post(array $args)
    {
        $media = new Media_Model;
        if (!isset($_FILES['file'])) {
            throw new HTTP301_Exception(self::http()->getRedir());
        }
        if ($error = $media->create(
            $_FILES['file'],
            isset($_GET['id']) ? $_GET['id'] : null
        )) {
            var_dump($error);
        }
        $this->template = null;
        return $this->view('template/file/done', compact('media'));
    }
}

