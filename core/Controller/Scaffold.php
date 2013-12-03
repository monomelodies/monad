<?php

namespace monad\core;
use StdClass;
use ErrorException;
use monolyth\HTTP301_Exception;
use monolyth\utils\Translatable;
use monad\admin\Login_Required;
use monad\admin\Controller;
use monad\admin\Helper;
use monad\admin\Searchable;

abstract class Scaffold_Controller extends Controller implements Login_Required
{
    use Translatable, Helper;

    /** If set, the actual controller we'll be using. */
    public $controller;

    protected function get(array $args)
    {
        unset($args['language']);
        if (!isset($args['database']) && count($this->databases) == 1) {
            $url = $this->url;
            throw new HTTP301_Exception($url(
                'monad/admin/scaffold',
                $args + [
                    'language' => $this->language->current->code,
                    'database' => $this->databases[0],
                ]
            ));
        }
        return $this->view(
            'page/databases',
            $args + ['databases' => $this->databases]
        );
    }

    protected function data()
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        if ($page < 1) {
            $page = 1;
        }
        $where = [];
        try {
            $where = isset($_GET['filters']) ?
                unserialize(base64_decode($_GET['filters'])) :
                [];
        } catch (ErrorException $e) {
        }
        if ($this->finder instanceof Searchable && isset($_GET['q'])) {
            $where = [[]];
            foreach ($this->finder->search as $field) {
                $where[0]["LOWER($field)"] = strtolower($_GET['q']);
            }
        }                
        $options = [];
        if (isset($_GET['s'], $_GET['d'])) {
            $_GET['s'] = preg_replace("@\W@", '', $_GET['s']);
            $_GET['d'] = preg_replace("@\W@", '', $_GET['d']);
            $options['order'] = "{$_GET['s']} {$_GET['d']}";
            if ($_GET['s'] != 'id') {
                $options['order'] .= ", id {$_GET['d']}";
            }
        }
        $items = $this->finder->all(
            $this->config->pageSize,
            $page,
            $where,
            $options
        );
        if (!$items && $page > 1) {
            throw new HTTP404_Exception();
        }
        return $items;
    }
    
    protected function parseKey($key)
    {
        try {
            return unserialize(base64_decode($key));
        } catch (ErrorException $e) {
            throw new HTTP404_Exception();
        }
    }
}

