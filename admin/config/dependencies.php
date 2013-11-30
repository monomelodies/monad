<?php

namespace monad\admin;
use monad\core\Model;
use monad\Language_Model;
use monad\User_Model;
use monolyth\DependencyContainer;
use monolyth\account\Login_Form;
use monolyth\render\Menu;
use monolyth\render\Paginator;
use monolyth\render\Media_Finder;
use monolyth\Config;
use monolyth\adapter\sql\Adapter;
use monolyth\account\Logout_Model;
use monolyth\render\form\File;
use monolyth\render\Css;
use monolyth\render\Script;
use monolyth\SQL_Session_Model;
use monolyth\File_Media_Model;
use monad\render\form\Foreignkey;
use monad\render\form\Media;
use monad\core\Text_Finder;
use ErrorException;

$basename = Model::generateBasename($match);
$container->register(
    'monolyth\Session_Access',
    ['session' => function() { return new SQL_Session_Model; }]
);
$container->register(
    'monad\core\Controller',
    [
        'adapters' => Config::get('adapters'),
        'language' => $language,
        'logout' => function() { return new Logout_Model; },
        'user' => function() { return new User_Model; },
        'siteselect' => function() { return new Site_Select; },
        'texts' => function() { return new Text_Finder; },
        'media' => function() { return new Media_Parser; },
        'Css' => function() { return new Css; },
        'Script' => function() { return new Script; },
    ]
);
$container->register('monad\core\Controller', compact('projectlanguage'));        
$container->register(
    "{$basename}_Finder",
    ['model' => function() use($basename) {
        $class = "{$basename}_Model";
        return new $class;
    }]
);
$container->register(
    'monad\core\Scaffold_Controller',
    [
        'config' => Config::get('monad'),
        'match' => $match,
        'databases' => call_user_func(function() {
            $adapters = [];
            foreach (Config::get('adapters') as $name => $def) {
                if ($name{0} == '_' or !($def instanceof Adapter)) {
                    continue;
                }
                $adapters[] = $name;
            }
            return $adapters;
        }),
        'finder' => function() use($basename) {
            $class = "{$basename}_Finder";
            if (class_exists($class)) {
                return new $class;
            }
            return null;
        },
        'model' => function() use($basename) {
            $class = "{$basename}_Model";
            if (class_exists($class)) {
                return new $class;
            }
            return null;
        },
        'form' => function() use($basename) {
            $class = "{$basename}_Form";
            if (class_exists($class)) {
                return new $class;
            }
            return null;
        },
        'paginator' => function() { return new Paginator(); },
        'actions' => [],
    ],
    function($o) use($container, $match) {
        if (!isset($o->model, $o->finder)) {
            return $o;
        }
        unset($match['controller'], $match['key']);
        if (method_exists($o->finder, 'all')) {
            $o->actions['list'] = $o->url('monad/admin/list', $match);
        }
        if (!($o->model instanceof Uncreateable_Model)) {
            $o->actions['create'] = $o->url(
                'monad/admin/create',
                $match
            );
        }
        $match = $match + ['key' => '%s'];
        if (method_exists($o->finder, 'find')) {
            if ($o->model instanceof Sortable
                && !($o->model instanceof Readonly_Model)
            ) {
                $o->actions['sort'] = '#';
            }
            $o->actions['view'] = $o->url('monad/admin/view', $match);
            if (!($o->model instanceof Readonly_Model)) {
                if (method_exists($o->model, 'save')) {
                    $o->actions['update'] = $o->url(
                        'monad/admin/update',
                        $match
                    );
                    if (!($o->model instanceof Uncreateable_Model)) {
                        $o->actions['copy'] = $o->url(
                            'monad/admin/copy',
                            $match
                        );
                    }
                }
                if (method_exists($o->model, 'delete')) {
                    $o->actions['delete'] = $o->url(
                        'monad/admin/delete',
                        $match
                    );
                }
            }
        }
    }
);
$container->register(
    'monad\core\Finder',
    ['model' => function() use($basename) {
        $class = "{$basename}_Model";
        if (class_exists($class)) {
            return new $class();
        }
        return null;
    }]
);
$container->register(
    'monad\core\Form',
    ['model' => function() use($basename) {
        $class = "{$basename}_Model";
        if (class_exists($class)) {
            return new $class();
        }
        return null;
    }]
);
$container->register(
    'monolyth\core\Form',
    [
        '_Foreignkey' => function() { return new Foreignkey; },
        '_Media' => function() { return new Media; },
    ]
);
$container->using(
    __NAMESPACE__,
    function() use($container, $language, $projectlanguage, $match) {
        $container->register(
            'Autolanguage_Controller',
            compact('language')
        );
        $container->register(
            'Login_Controller',
            ['form' => function() { return new Login_Form; }]
        );
        $container->register(
            'Logout_Controller',
            ['logout' => function() { return new Logout_Model; }]
        );
        $container->register(
            'Finder',
            ['_menu' => function() { return new Menu; }]
        );
        $container->register(
            ['Media_Controller', 'Multi_Media_Controller'],
            [
                'medias' => function() { return new Media_Finder; },
                'helper' => function() { return new Media_Helper; },
            ]
        );
        $container->register(
            'Language_Access',
            compact('projectlanguage', 'language')
        );
        $container->register(
            'Menu_Model',
            ['item' => function() { return new Inline_Item_Menu_Model; }]
        );
        $container->register(
            'Browse_File_Controller',
            [
                'folders' => function() { return new Folder_Finder; },
                'folder' => function() { return new Folder_Model; },
                'medias' => function() { return new namespace\Media_Finder; },
            ]
        );
        $container->register(
            'Upload_File_Controller',
            [
                'media' => function() { return new File_Media_Model; },
                'medias' => function() { return new namespace\Media_Finder; },
            ]
        );
        $container->register(
            'Reorder_Controller',
            ['sort' => function() { return new Sort_Model; }]
        );
        $container->register(
            'Sort_Model',
            ['items' => function() { return new Item_Menu_Finder; }]
        );
        $container->register(
            ['Frame_File_Controller', 'View_File_Controller'],
            ['medias' => function() { return new namespace\Media_Finder; }]
        );
        $container->register(
            'Frame_File_Controller',
            ['input' => function() { return new File; }]
        );
        $container->register(
            'Media_Finder',
            ['model' => function() { return new File_Media_Model; }]
        );
        $container->register(
            'Menu_Finder',
            [
                'items' => function() { return new Item_Menu_Finder; },
                'item' => function() { return new Inline_Item_Menu_Model; },
            ]
        );
        $container->register(
            'Item_Menu_Finder',
            ['item' => function() { return new Inline_Item_Menu_Model; }]
        );
        $container->register(
            'Move_File_Controller',
            ['media' => function() { return new File_Media_Model; }]
        );
    }
);
$finder = $container->satisfy(new Module_Finder);
foreach ($finder->all() as $module => $dummy) {
    if ($module == 'monad') {
        continue;
    }
    try {
        include "$module/admin/config/dependencies.php";
    } catch (ErrorException $e) {
    }
}
try {
    include 'admin/config/dependencies.php';
} catch (ErrorException $e) {
}
unset($finder);

