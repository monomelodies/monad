<?php

namespace monad\admin;
use monad\core\Scaffold_Controller;
use monolyth\adapter\sql\Resultset;

class List_Controller extends Scaffold_Controller
{
    use Helper;

    protected $viewname = 'monad\admin\page/list';

    protected function get(array $args)
    {
        unset($args['language']);
        $items = $this->data();
        $actions = $this->actions;
        $finder = $this->finder;
        if ($items instanceof Resultset) {
            $this->paginator->init(__CLASS__, $args, $items);
        }
        return $this->view(
            $this->viewname,
            compact('items', 'actions', 'finder') + $args
        );
    }
}

