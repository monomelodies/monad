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
use monad\admin\Searchable;

abstract class Scaffold_Controller extends Controller implements Login_Required
{
    use Translatable, Helper;

    public function __invoke($method, array $arguments)
    {
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
                    $this->user->loggedIN()
                        && call_user_func_array(
                            [$this->user, 'inGroup'],
                            $require_groups
                    ),
                    function() use($redir, $language) {
                        call_user_func($this->logout);
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
        try {
            $where = isset($_GET['filters']) ?
                unserialize(base64_decode($_GET['filters'])) :
                [];
        } catch (ErrorException $e) {
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
        $items = $this->finder->all(
            $this->config->pageSize,
            $page,
            $where,
            $options
        );
        if (!$items && $page > 1) {
            throw new HTTP404_Exception();
        }
        return $items;
    }
    
    protected function parseKey($key)
    {
        try {
            return unserialize(base64_decode($key));
        } catch (ErrorException $e) {
            throw new HTTP404_Exception();
        }
    }
}

