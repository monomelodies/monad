<?php

namespace monad\core;
use monolyth\DependencyContainer;
use monolyth\render\Translate_Parser;
use monolyth\ui\Menu;
use monad\admin\Model;
use monad\admin\Finder;
use monad\admin\Module_Finder;
use Project as Myproject;

$container->using(__NAMESPACE__, function() use($container, $myproject) {
    $container->register(
        'Controller',
        [
            'translateParser' => function() { return new Translate_Parser; },
            'admin' => function() { return new Model; },
            'admins' => function() { return new Finder; },
            'myproject' => $myproject,
            'modules' => function() { return new Module_Finder; },
        ]
    );
});

