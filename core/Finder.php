<?php

namespace monad\core;
use monolyth;
use monolyth\adapter;
use Adapter_Access;

abstract class Finder implements monolyth\Finder
{
    use Adapter_Access;

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

