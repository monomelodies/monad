<?php

namespace monad;
use monolyth\DependencyContainer;
use monolyth\SQL_Session_Model;

$projectlanguage = $language;
unset($language);
$language = new Language_Model;
if (isset($match['language'])) {
    try {
        $language->set($match['language']);
    } catch (monolyth\LanguageNotFound_Exception $e) {
    }
}
$container->register(
    'monolyth\Language_Access',
    compact('language')
);
$myproject = $project;
$project = new admin\Project($theme);
$project['public'] = $myproject['public'];
$project['site'] = $myproject['site'];
$container->register('monolyth\Project_Access', compact('project'));
require 'monolyth/config/dependencies.php';
$container->register(
    'monolyth\Session_Access',
    ['session' => function() { return new SQL_Session_Model; }]
);
require 'monad/config/base.dependencies.php';
require 'monad/core/config/dependencies.php';
require 'monad/admin/config/dependencies.php';

