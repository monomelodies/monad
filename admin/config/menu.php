<?php

namespace monad\admin;

$menu->using(__NAMESPACE__, function() use($menu) {
    if ($menu->user()->inGroup('Administrators')) {
        $menu->group('content')->add('page')
                               ->add('menu');
    }
});

