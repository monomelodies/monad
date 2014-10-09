<?php

namespace monad\core;
use StdClass;
use ErrorException;
use monolyth\HTTP301_Exception;
use monolyth\utils\Translatable;
use monolyth\DependencyContainer;
use monad\admin\Login_Required;
use monad\admin\Controller;
use monad\admin\Helper;
use monolyth\Config;
use monolyth\account\Logout_Model;
use monad\admin\Searchable;
use monad\admin\Sortable;
use monad\admin\Readonly_Model;
use monad\admin\Editable_Model;
use monad\admin\Uncreateable_Model;
use monad\admin\Uncopyable_Model;

abstract class Scaffold_Controller extends Controller implements Login_Required
{
    use Translatable;
    use Helper;

    public function __invoke($method, array $arguments)
    {
        $basename = Model::generateBasename($arguments);
        $db = isset($arguments['database']) ? $arguments['database'] : null;
        $class = "{$basename}_Finder";
        $this->finder = class_exists($class) ? $class::instance($db) : null;
        $class = "{$basename}_Model";
        $this->model = class_exists($class) ? new $class($db) : null;
        $class = "{$basename}_Form";
        $this->form = class_exists($class) ? new $class : null;

        $this->actions = [];
        if (method_exists($this->finder, 'all')) {
            $this->actions['list'] = $this->url(
                'monad/admin/list',
                [
                    'package' => $arguments['package'],
                    'target' => $arguments['target'],
                ] + (isset($arguments['database']) ?
                    ['database' => $arguments['database']] :
                    []
                )
            );
        }
        if (!($this->model instanceof Uncreateable_Model)) {
            $this->actions['create'] = $this->url(
                'monad/admin/create',
                $arguments
            );
        }
        $arguments = $arguments + ['key' => '%s'];
        if (method_exists($this->finder, 'find')) {
            if ($this->model instanceof Sortable
                && !($this->model instanceof Readonly_Model)
            ) {
                $this->actions['sort'] = $this->url(
                    'monad/admin/move',
                    $arguments
                );
            }
            $this->actions['view'] = $this->url('monad/admin/view', $arguments);
            if (!($this->model instanceof Readonly_Model)) {
                if (method_exists($this->model, 'save')) {
                    if (!($this->model instanceof Uneditable_Model)) {
                        $this->actions['update'] = $this->url(
                            'monad/admin/update',
                            $arguments
                        );
                    }
                    if (!($this->model instanceof Uncopyable_Model)) {
                        $this->actions['copy'] = $this->url(
                            'monad/admin/copy',
                            $arguments
                        );
                    }
                }
                if (method_exists($this->model, 'delete')) {
                    $this->actions['delete'] = $this->url(
                        'monad/admin/delete',
                        $arguments
                    );
                }
            }
        }

        try {
            $acl = include "{$arguments['package']}/config/acl.php";
            $require_groups = [];
            foreach ($acl as $settings) {
                list($groups, $objects) = $settings;
                if (!is_array($groups)) {
                    $groups = preg_split('@\s*|\s*@', $groups);
                }
                if ($objects == '*') {
                    $require_groups = array_merge($require_groups, $groups);
                    continue;
                }
                if (!is_array($objects)) {
                    $objects = preg_split('@\s*|\s*@', $objects);
                }
                if (in_array($arguments['target'], $objects)) {
                    $require_groups = array_merge($require_groups, $groups);
                }
            }
            if ($require_groups) {
                $this->addRequirement(
                    'monad\admin\Login_Required',
                    self::user()->loggedIn()
                        && call_user_func_array(
                            [self::user(), 'inGroup'],
                            $require_groups
                    ),
                    function() use($redir, $language) {
                        call_user_func(new Logout_Model);
                        throw new HTTP301_Exception(
                            $this->url('monad/admin/login').'?redir='.urlencode($redir)
                        );
                    }
                );
            }
        } catch (ErrorException $e) {
        }
        return parent::__invoke($method, $arguments);
    }

    protected function get(array $args)
    {
        unset($args['language']);
        if (!isset($args['database']) && count($this->databases) == 1) {
            $url = $this->url;
            throw new HTTP301_Exception($url(
                'monad/admin/scaffold',
                $args + [
                    'language' => $this->language->current->code,
                    'database' => $this->databases[0],
                ]
            ));
        }
        return $this->view(
            'page/databases',
            $args + ['databases' => $this->databases]
        );
    }

    protected function data()
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        if ($page < 1) {
            $page = 1;
        }
        $where = [];
        if (isset($_GET['f'])) {
            $ffields = array_keys($this->finder->filters());
            foreach ($_GET['f'] as $key => $value) {
                if (strlen($value)) {
                    $where[$ffields[$key]] = $value;
                }
            }
        }
        if ($this->finder instanceof Searchable && isset($_GET['q'])) {
            $where = [[]];
            foreach ($this->finder->search as $field) {
                $where[0]["LOWER($field)"] = strtolower($_GET['q']);
            }
        }                
        $options = [];
        if (isset($_GET['s'], $_GET['d'])) {
            $_GET['s'] = preg_replace("@\W@", '', $_GET['s']);
            $_GET['d'] = preg_replace("@\W@", '', $_GET['d']);
            $options['order'] = "{$_GET['s']} {$_GET['d']}";
            if ($_GET['s'] != 'id') {
                $options['order'] .= ", id {$_GET['d']}";
            }
        }
        $config = Config::get('monad');
        $items = $this->finder->all(
            $config->pageSize,
            $page,
            $where,
            $options
        );
        if (!$items && $page > 1) {
            throw new HTTP404_Exception;
        }
        return $items;
    }
    
    protected function parseKey($key)
    {
        try {
            return unserialize(base64_decode($key));
        } catch (ErrorException $e) {
            throw new HTTP404_Exception;
        }
    }
}

