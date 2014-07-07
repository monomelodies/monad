<?php

namespace monad\api;
use monolyth\Controller;
use monolyth\HTTP404_Exception;
use monad\Page_Access;

class Body_Page_Controller extends Controller
{
    use Page_Access;

    protected $template = false;

    protected function get(array $args)
    {
        extract($args);
        if (!($page = self::pages()->find($slug))) {
            throw new HTTP404_Exception();
        }
        return $this->view("\\{$page['viewname']}", compact('page'));
    }
}

