<?php

namespace monad;
use monolyth\db;
use monolyth\Controller;
use monolyth\HTTP404_Exception;

class Static_Page_Controller extends Controller
{
    protected function get(array $args)
    {
        extract($args);
        if (!($page = $this->pages->find($slug))) {
            throw new HTTP404_Exception();
        }
        return $this->view($page['viewname'], compact('page'));
    }

    public function arguments(array $args = [])
    {
        $new = $args + parent::arguments();
        if (!isset($new['language'])) {
            return $new;
        }
        $language = $this->language->current->id;
        foreach ($this->language->available as $lang) {
            if ($lang->code == $new['language']) {
                $language = $lang->id;
                break;
            }
        }
        $page = $this->pages->find($new['slug'], $language);
        $new['slug'] = $page['slug'];
        return $new;
    }
}

