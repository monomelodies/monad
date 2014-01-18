<?php

namespace monad\admin;

class Media_Controller extends Controller
{
    protected function get(array $args)
    {
        extract($args);
        if (!($media = Media_Finder::instance()->find($id))) {
            throw new HTTP404_Exception;
        }
        $args['mimetype'] = $media['mimetype'];
        if (isset($type)) {
            switch ($type) {
                case 'png': $args['mimetype'] = 'image/png'; break;
                case 'jpg':
                case 'jpeg':
                    $args['mimetype'] = 'image/jpeg';
                    break;
            }
        }
        $this->template = false;
        $helper = new Media_Helper;
        return $this->view('misc/media', compact('media', 'helper') + $args);
    }
}

