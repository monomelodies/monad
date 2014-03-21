<?php

namespace monad\admin;
use monad\core\Scaffold_Controller;
use monolyth\adapter\sql\Resultset;
use monolyth\render\Paginator;

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
        $paginator = null;
        if ($items instanceof Resultset) {
            $paginator = new Paginator(__CLASS__, $args, $items);
        }
        return $this->view(
            $this->viewname,
            compact('items', 'actions', 'finder', 'paginator') + $args
        );
    }
}

