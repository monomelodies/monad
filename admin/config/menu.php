<?php

namespace monad\admin;

$menu->using(__NAMESPACE__, function() use($menu) {
    if (in_array('Administrator', $menu->user->groups())) {
        $menu->group('content')->add('page')
                               ->add('menu');
    }
});

