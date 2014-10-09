<?php

namespace monad\admin;
use monad\core;
use monolyth\render\FileNotFound_Exception;
use monolyth\utils\Translatable;

class Controller extends core\Controller implements Login_Required
{
    use Translatable, Helper;

    protected function get()
    {
        try {
            $class = get_called_class();
            $ns = substr($class, 0, strrpos($class, '\\'));
            $class = substr($class, strrpos($class, '\\') + 1);
            $class = preg_replace('@_?controller$@', '', strtolower($class));
            if (strlen($class)) {
                $class .= '/';
            }
            $view = $this->view("$ns\\{$class}default");
        } catch (FileNotFound_Exception $e) {
            $view = $this->view('default');
        }
        $view->data([
            'name' => substr(
                get_class($this),
                0,
                strpos(get_class($this), '\\')
            ),
            'self' => $this,
        ]);
        return $view;
    }
}

