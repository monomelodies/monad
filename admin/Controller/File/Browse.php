<?php

namespace monad\admin;
use monad\core;
use monolyth\HTTP301_Exception;

class Browse_File_Controller extends core\Controller
{
    protected function get(array $args)
    {
        $this->template = $this->view([
            'template/popup',
            'monolyth\template/page',
        ]);
        $folder = null;
        if (isset($_GET['id']) && (int)$_GET['id']) {
            $folder = (int)$_GET['id'];
        }
        $folders = $this->folders->all();
        $files = $this->medias->all($folder);
        return $this->view('page/file/browse', compact('folders', 'files'));
    }

    protected function post(array $args)
    {
        if (isset($_POST['folder'])) {
            $parent = null;
            $this->folder->create($_POST['folder'], $parent);
        }
        throw new HTTP301_Exception($this->http->getSelf());
    }
}

