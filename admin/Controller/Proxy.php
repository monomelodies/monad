<?php

namespace monad\admin;
use monad\core;

abstract class Proxy_Controller extends core\Controller
{
    protected function get(array $args)
    {
        $this->template = null;
        extract($args);
        switch (str_replace(__NAMESPACE__, '', get_class($this))) {
            case '\CSS_Proxy_Controller': $type = 'css'; break;
            case '\JS_Proxy_Controller': $type = 'js'; break;
            case '\Media_Proxy_Controller': $type = 'img'; break;
            default: throw new HTTP404_Exception();
        }
        if ($module == 'project') {
            $module = '';
        } else {
            $module = "$module/";
        }
        $filename = "{$module}output/$type/$file";
        return $this->view('page/proxy', compact('filename', 'type'));
    }
}

