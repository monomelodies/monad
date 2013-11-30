<?php

namespace monad\admin;

return function($m) use($project) {
    $m->connect('/monad', 'monad\admin\Autolanguage', $project['http']);
    $m->connect('/monad/', 'monad\admin\Autolanguage', $project['http']);
    $m->setDefaultDomain($project['https']);
    $m->connect('/monad', 'monad\admin\Autolanguage');
    $m->connect('/monad/', 'monad\admin\Autolanguage');
    $m->connect('/monad/redirect/', 'monad\admin\Redirect');
    $m->connect(
        '/monad/media/(%d:id).(%s:size).(%s:type)',
        'monad\admin\Media'
    );
    $m->connect(
        '/monad/media/multi/(%a:ids).(%s:size).(%s:type)',
        'monad\admin\Multi_Media'
    );
    $m->connect(
        '/monad/media/(%d:id).(%s:type)',
        'monad\admin\Media'
    );
    $m->connect('/monad/(%s:language)/', 'monad\admin');
    $m->connect('/monad/(%s:language)/login/', 'monad\admin\Login');
    $m->connect('/monad/(%s:language)/file/', 'monad\admin\Browse_File');
    $m->connect('/monad/(%s:language)/file/add/', 'monad\admin\Upload_File');
    $m->connect(
        '/monad/(%s:language)/ajax/file/move/',
        'monad\admin\Move_File'
    );
    $m->connect(
        '/monad/(%s:language)/ajax/reorder/',
        'monad\admin\Reorder'
    );
    $m->connect(
        '/monad/(%s:language)/file/(%d:id)/frame/',
        'monad\admin\Frame_File'
    );
    $m->connect(
        '/monad/(%s:language)/file/(%d:id)/view/',
        'monad\admin\View_File'
    );
    $m->connect(
        '/monad/(%s:language)/file/(%s:type)/',
        'monad\admin\Browse_File'
    );
    $m->connect(
        '/monad/(%s:language)/file/(%s:type)/add/',
        'monad\admin\Upload_File'
    );
    $m->connect('/monad/(%s:language)/logout/', 'monad\admin\Logout');
    $scaffold = '/monad/(%s:language)/(%s:package)/(%s:target)/';
    $m->connect($scaffold, 'monad\admin\Database');
    $scaffold .= "(%s:database)";
    $m->connect("$scaffold/", 'monad\admin\List');
    $m->connect("$scaffold/create/", 'monad\admin\Create');
    $scaffold .= "/(%s:key)";
    $m->connect("$scaffold/", 'monad\admin\View');
    $m->connect("$scaffold/update/", 'monad\admin\Update');
    $m->connect("$scaffold/copy/", 'monad\admin\Copy');
    $m->connect("$scaffold/delete/", 'monad\admin\Delete');
    $m->connect(
        '/css/wysiwyg/(%s:package)/(%s:target)/(%s:field)/(%s:override).css',
        'monad\admin\Wysiwyg_Style'
    );
    $m->connect(
        '/css/wysiwyg/(%s:package)/(%s:target)/(%s:field).css',
        'monad\admin\Wysiwyg_Style'
    );
    $m->connect('/(%s:module)/css/(%a:file)', 'monad\admin\CSS_Proxy');
    $m->connect('/(%s:module)/js/(%a:file)', 'monad\admin\JS_Proxy');
    $m->setDefaultDomain($project['http']);
    return $m;
};

