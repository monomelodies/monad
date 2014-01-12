<?php

namespace monad\core;
use ErrorException;
use monolyth\Language_Access;
use monolyth\render\Url_Helper;
use monolyth\utils\Translatable;

class Menu_Model
{
    use Url_Helper;
    use Translatable;
    use Language_Access;
    use Permission;

    private $namespace = '';
    private $items = [];
    private $title;
    private $mother;
    private $requires = [];

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
        $callback();
        return $this;
    }

    public function requires($callback)
    {
        $args = func_get_args();
        if (count($args) == 3) {
            list($group, $actions, $callback) = $args;
        } elseif (count($args) == 2) {
            list($group, $callback) = $args;
            $actions = null;
        } elseif (count($args) == 1) {
            $group = null;
            $actions = null;
        }
        $old = $this->requires;
        $this->requires = compact('group', 'actions');
        $callback();
        $this->requires = $old;
    }

    public function add($target, $link = null, $package = null)
    {
        if (!isset($link)) {
            $link = 'monad/admin/database';
        }
        if (!isset($package)) {
            $package = $this->package();
        }
        if ($package == 'admin') {
            $package = 'project';
        }
        $this->items["$package $target"] = new Item_Model(
            $this->url(
                $link,
                compact('package', 'target')
            ),
            $this->text(sprintf(
                '%s\menu/%s/%s',
                $this->namespace,
                $this->mother(),
                $target
            )),
            $this->requires
        );
        return $this;
    }

    public function group($target, $package = null)
    {
        if (!isset($package)) {
            $package = $this->package();
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

    public function find($what)
    {
        $me = get_class($this);
        foreach ($this->items as $key => $value) {
            if ($key == $what) {
                return $value;
            }
            if ($value instanceof $me) {
                if ($found = $value->find($what)) {
                    return $found;
                }
            }
        }
        return null;
    }

    public function delete($item)
    {
        foreach ($this->items as $key => $value) {
            if ($value == $item) {
                unset($this->items[$key]);
            }
        }
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

    private function package()
    {
        $package = substr(
            $this->namespace,
            0,
            strpos($this->namespace, '\\')
        );
        if (!$package) {
            $package = 'admin';
        }
        return $package;
    }
}

