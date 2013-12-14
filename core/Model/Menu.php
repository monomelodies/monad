<?php

namespace monad\core;
use ErrorException;
use monolyth\Language_Access;
use monolyth\render\Url_Helper;
use monolyth\utils\Translatable;

class Menu_Model implements Language_Access
{
    use Url_Helper;
    use Translatable;

    private $namespace = '';
    private $items = [];
    private $title;
    private $mother;

    public function init($file)
    {
        try {
            $menu = $this;
            call_user_func(function() use($menu, $file) {
                include $file;
            });
            return $this;
        } catch (ErrorException $e) {
            throw new MenuNotFound_Exception;
        }
    }

    public function using($namespace, $callback)
    {
        $this->namespace = $namespace;
        return $callback();
    }

    public function add($target, $package = null, $link = null)
    {
        if (!isset($link)) {
            $link = 'monad\admin\database';
        }
        if (!isset($package)) {
            $package = substr(
                $this->namespace,
                0,
                strpos($this->namespace, '\\')
            );
        }
        $this->items[$this->url(
            $link,
            compact('package', 'target')
        )] = $this->text(sprintf(
            '%s\menu/%s/%s',
            $this->namespace,
            $this->mother(),
            $target
        ));
        return $this;
    }

    public function group($target, $package = null)
    {
        if (!isset($package)) {
            $package = substr(
                $this->namespace,
                0,
                strpos($this->namespace, '\\')
            );
        }
        $menu = clone $this;
        $menu->reset();
        $menu->title($this->text("{$this->namespace}\menu/$target"));
        $menu->mother($target);
        $this->items["$package $target"] = $menu;
        return $menu;
    }

    public function items()
    {
        return $this->items;
    }

    public function reset()
    {
        $this->items = [];
    }

    public function title($title = null)
    {
        if (isset($title)) {
            $this->title = $title;
        }
        return $this->title;
    }

    public function mother($mother = null)
    {
        if (isset($mother)) {
            $this->mother = $mother;
        }
        return $this->mother;
    }
}

