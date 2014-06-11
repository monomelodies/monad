<?php

namespace monad\core;
use monolyth;
use monolyth\adapter;
use Adapter_Access;
use monolyth\core\Singleton;

abstract class Finder implements monolyth\Finder
{
    use Adapter_Access;
    use Singleton;

    public $view = 'monad\admin\slice/table';
    public $stripTags = true;

    public abstract function all($s, $p, array $w = [], array $o = []);

    public function models($m, $s, $p, array $w = [], array $o = [])
    {
        $list = [];
        $model = isset($m) ?
            $m :
            str_replace('_Finder', '_Model', get_class($this));
        if ($all = $this->all($s, $p, $w, $o)) {
            foreach ($all as $one) {
                $list[] = (new $model)->load($one);
            }
        }
        return $list ? $list : new $model;
    }

    public function filters()
    {
        return null;
    }

    public function defaultFilter()
    {
        return null;
    }
}

