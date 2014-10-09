<?php

namespace monad\core;
use monolyth;
use monolyth\adapter;
use Adapter_Access;
use monolyth\core\Singleton;

abstract class Finder implements monolyth\Finder
{
    use Adapter_Access, Singleton {
        Adapter_Access::adapter as _adapter;
        Singleton::instance as _instance;
    }

    public $view = 'monad\admin\table';
    public $stripTags = true;
    private static $db;

    public abstract function all($s, $p, array $w = [], array $o = []);

    public static function instance($db = null)
    {
        $object = self::_instance();
        $object->using($db);
        return $object;
    }

    public function using($db)
    {
        self::$db = $db;
    }

    public static function adapter($db = null)
    {
        return self::_adapter(isset($db) ? $db : self::$db);
    }

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

