<?php

namespace monad\admin;

$menu->using(__NAMESPACE__, function() use($menu) {
    $group = $menu->group('content');
    $group->add('page');
    $group->add('menu');
});

