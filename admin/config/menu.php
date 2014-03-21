<?php

namespace monad\admin;

$menu->using(__NAMESPACE__, function() use($menu) {
    $menu->requires('Administrators', function() use($menu) {
        $menu->group('content')->add('page')
                               ->add('menu')
                               ->hidden('menu_item')
                               ->hidden('section')
                               ->hidden('file')
                               ->hidden('ajax');
    });
});

