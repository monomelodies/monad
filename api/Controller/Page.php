<?php

namespace monad\api;
use monolyth\Controller;
use monolyth\HTTP404_Exception;
use monad\Page_Access;

class Page_Controller extends Controller
{
    use Page_Access;

    protected $template = false;

    protected function get(array $args)
    {
        extract($args);
        if (!($page = self::pages()->find($slug))) {
            throw new HTTP404_Exception();
        }
        return $this->view('monolyth\render\json', ['data' => $page]);
    }

    public function arguments(array $args = [])
    {
        $new = $args + parent::arguments();
        if (!isset($new['language'])) {
            return $new;
        }
        $language = self::language()->current->id;
        foreach (self::language()->available as $lang) {
            if ($lang->code == $new['language']) {
                $language = $lang->id;
                break;
            }
        }
        $page = self::pages()->find($new['slug'], $language);
        $new['slug'] = $page['slug'];
        return $new;
    }
}

