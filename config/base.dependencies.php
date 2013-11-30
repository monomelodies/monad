<?php

namespace monad;
use monolyth\DependencyContainer;
use monolyth\render\Menu;
use monolyth\render\Item_Menu;

$container->using(__NAMESPACE__, function() use($container) {
    $container->register(
        'Static_Page_Controller',
        ['pages' => function() { return new Page_Finder; }]
    );
    $container->register(
        'Page_Finder',
        ['page' => function() { return new Page_Model; }]
    );
    $container->register(
        'Menu_Finder',
        [
            'menu' => function() { return new Menu_Model; },
            '_menu' => function() { return new Menu; },
            '_item' => function() { return new Item_Menu; },
            'page' => function() { return new Page_Model; },
        ]
    );
});
$container->register(
    'monolyth\Controller',
    ['menus' => function() { return new Menu_Finder; }]
);

