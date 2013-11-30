<?php

namespace monad\core;
use monolyth\core, project\core\Project;

abstract class Utils extends core\Utils
{
    public static function findModels($dbname, $array, $path = array())
    {
        $models = array();
        foreach ($array as $base => $entry) {
            if (is_array($entry)) {
                $models = array_merge(
                    $models,
                    self::findmodels(
                        $dbname,
                        $entry,
                        array_merge($path, array(array_pop(explode('/', $base))))
                    )
                );
            } else {
                foreach (explode(PATH_SEPARATOR, get_include_path()) as $strip) {
                    $base = str_replace("$strip/", '', $base);
                }
                list($namespace, $name) = explode('/model', $base);
                $name = str_replace('/', '_', substr($name, 1));
                $name = preg_replace('@\.php$@', '', $name);
                if (
                    preg_match('@Abstract$@', $name)
                    or ($namespace == 'monolyth'
                        && (in_array($name, array('Table', 'Group', 'View',
                            'Join', 'Tree', 'Exception')))
                    )
                ) {
                    continue;
                }
                $name = "\\$namespace\\model\\$name";
                $c = new $name();
                if (
                    !($dbnames = $c->dbnames() and $dbnames) or
                    (in_array($dbname, $dbnames) && $c->has_editable())
                ) {
                    $models[] = preg_replace('@model$@', '', strtolower($name));
                }
            }
        }
        return $models;
    }

    public static function findViews($array, $path = array())
    {
        $views = array(
            Model::VIEW_TEMPLATE => array(),
            Model::VIEW_PAGE => array(),
            Model::VIEW_SLICE => array(),
        );
        foreach ($array as $base => $entry) {
            if (is_array($entry)) {
                $tmp = self::findViews(
                    $entry,
                    array_merge($path, array(array_pop(explode('/', $base))))
                );
                foreach ($views as $key => &$value) {
                    $value = array_merge($value, $tmp[$key]);
                }
            } else {
                $path = explode('/', $base);
                if (!in_array('view', $path)) {
                    continue;
                }
                if (!preg_match("@\.php$@", $entry)) {
                    continue;
                }
                $mypath = $path;
                while ($mypath[0] != 'view') {
                    array_shift($mypath);
                }
                array_shift($mypath);
                $type = array_shift($mypath);
                switch ($type) {
                    case 'template': $type = Model::VIEW_TEMPLATE; break;
                    case 'page': $type = Model::VIEW_PAGE; break;
                    case 'slice': $type = Model::VIEW_SLICE; break;
                }
                $views[$type][] = implode('/', $mypath);
            }
        }
        return $views;
    }

    public static function buildFileList()
    {
        $files = array();
        foreach (Project::$paths as $path) {
            foreach (array('model', 'view') as $subdir) {
                if (file_exists(BASE_PATH."$path/$subdir")) {
                    if (!isset($files[$subdir])) {
                        $files[$subdir] = array();
                    }
                    $files[$subdir] += self::getFiles(
                        BASE_PATH."$path/$subdir",
                        -1,
                        ".*?.php"
                    );
                }
            }
        }
        $_SESSION['_files_'] = $files;
    }
}

