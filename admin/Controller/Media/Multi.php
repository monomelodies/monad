<?php

namespace monad\admin;

class Multi_Media_Controller extends Controller
{
    protected function get(array $args)
    {
        extract($args);
        $ids = explode(',', $ids);
        if (!($medias = Media_Finder::instance()->ids($ids))) {
            throw new HTTP404_Exception;
        }
        uasort($medias, function($a, $b) {
            if ($a['originalname'] == $b['originalname']) {
                return $a['id'] < $b['id'] ? -1 : 1;
            }
            return $a['originalname'] < $b['originalname'] ? -1 : 1;
        });
        switch ($type) {
            case 'png': $args['mimetype'] = 'image/png'; break;
            case 'jpg':
            case 'jpeg':
                $args['mimetype'] = 'image/jpeg';
                break;
        }
        $this->template = false;
        $helper = new Media_Helper;
        return $this->view(
            'misc/media/multi',
            compact('medias', 'helper') + $args
        );
    }
}

