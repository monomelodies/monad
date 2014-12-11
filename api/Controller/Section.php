<?php

namespace monad\api;
use monolyth\Controller;
use monolyth\HTTP404_Exception;
use monad\Page_Access;
use monad\Section_Access;

class Section_Controller extends Controller
{
    use Page_Access;
    use Section_Access;

    protected $template = false;

    protected function get(array $args)
    {
        extract($args);
        if (!($page = self::pages()->find($slug))) {
            throw new HTTP404_Exception;
        }
        if (!($sections = self::sections()->all($page['id']))) {
            throw new HTTP404_Exception;
        }
        return $this->view('monolyth\render\page/json', ['data' => $sections]);
    }
}

