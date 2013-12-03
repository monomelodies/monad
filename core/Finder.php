<?php

namespace monad\core;
use monolyth;
use monolyth\adapter;

abstract class Finder implements monolyth\Finder, adapter\Access
{
    public $view = 'monad\admin\slice/table';
    public $stripTags = true;

    public abstract function all($size, $page, array $where = [],
        array $options = []);

    public function filters()
    {
        return null;
    }

    public function defaultFilter()
    {
        return null;
    }
}

