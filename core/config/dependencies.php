<?php

namespace monad\core;
use monolyth\DependencyContainer;
use monolyth\render\Translate_Parser;
use monad\admin\Module_Finder;
use Project as Myproject;

$container->using(__NAMESPACE__, function() use($container, $myproject) {
    $container->register(
        'Controller',
        [
            'translateParser' => function() { return new Translate_Parser; },
            'admins' => function() { return new Menu_Finder; },
            'myproject' => $myproject,
            'modules' => function() { return new Module_Finder; },
        ]
    );
    $container->register(
        'Menu_Finder',
        ['menu' => function() { return new Menu_Model; }]
    );        
});

