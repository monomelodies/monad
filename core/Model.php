<?php

namespace monad\core;
use monolyth\core;

abstract class Model extends core\Model
{
    const INLINE_POSITION = 'after';

    public $requires = [];

    public static function generateBasename(array &$args)
    {
        if (!isset($args['package'])) {
            $args['package'] = substr(
                $args['controller'],
                0,
                strpos($args['controller'], '\\')
            );
        }
        if (!isset($args['target'])) {
            $controller = $args['controller'];
            $actions = ['View', 'Create', 'Update', 'Copy', 'Delete'];
            $actions = '('.implode('|', $actions).')';
            $args['target'] = implode('_', array_reverse(explode(
                '_',
                strtolower(preg_replace(
                    "@
                        .*? # all namespace data
                        \\\\ # backslash (double-escaped)
                        ({$actions}_)? # exclude valid actions
                        ([A-Z][a-zA-Z_]+) # what actually interests us now...
                        _Controller
                     @x",
                    '$3',
                    $args['controller']
                ))
            )));
        }
        $parts = array_reverse(explode('_', $args['target']));
        if ($args['package'] == 'admin') {
            $args['package'] = 'project';
            $ns = '\admin\\';
        } else {
            $ns = $args['package'] == 'project' ?
                '\admin\\' :
                "\\{$args['package']}\\admin\\";
        }
        $parts = array_map('ucfirst', $parts);
        return $ns.implode('_', $parts);
    }

    public function keys()
    {
        return ['id'];
    }

    public function order()
    {
        return 'id ASC';
    }

    public function inlines()
    {
        return [];
    }
}

