<?php

namespace monad\api;

return function($m) use($project) {
    $m->connect('/page/(%s:language)/(%s:slug)/', 'monad\api\Page');
    $m->connect(
        '/page/(%s:language)/(%s:slug)/body/',
        'monad\api\Body_Page'
    );
    $m->connect('/section/(%s:language)/(%s:slug)/', 'monad\api\Section');
    return $m;
};

