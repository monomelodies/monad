<?php

namespace monad\utils;
use monolyth\core;

abstract class View
{
    const FILTER_TEMPLATE = 1;
    const FILTER_PAGE = 2;
    const FILTER_SLICE = 4;

    public static function find($base = null, $filter = 1)
    {
        $found = array();
        if (!isset($base)) {
            $paths = explode(PATH_SEPARATOR, get_include_path());
            foreach ($paths as $path) {
                if (strpos($path, \project\BASE_PATH) === false) {
                    continue;
                }
                $found = array_merge($found, self::find($path, $filter));
            }
            return $found;
        }
        
        $paths = explode(PATH_SEPARATOR, get_include_path());
        $shortest = \project\BASE_PATH;
        foreach ($paths as $path) {
            if (strlen($path) < strlen($shortest)
                && strpos($shortest, $path) !== false
            ) {
                $shortest = $path;
            }
        }
        $parts = array();
        foreach ($paths as $path) {
            if (strpos($path, $shortest) === false) {
                continue;
            }
            $try = str_replace($shortest, '', $path);
            if (strlen($try)) {
                $parts[] = $try;
            }
        }
        $shortest = $shortest.'('.implode('|', $parts).')?';

        try {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($base),
                \RecursiveIteratorIterator::CHILD_FIRST
            );
        } catch (\UnexpectedValueException $e) {
            return $found;
        }
        foreach ($iterator as $file) {
            if (is_dir($file)) {
                continue;
            }
            if (substr($file->getFilename(), 0, 1) == '.'
                || strpos($file->getPathname(), '/.') !== false
            ) {
                continue;
            }
            if (strpos($file->getPathname(), 'output/html') === false) {
                continue;
            }
            $file = preg_replace("@^$shortest@", '', "$file");
            $parts = explode('/output/html/', str_replace($base, '', $file));
            if ($filter & self::FILTER_TEMPLATE
                && substr($parts[1], 0, 9) == 'template/'
            ) {
                continue;
            }
            if ($filter & self::FILTER_PAGE
                && substr($parts[1], 0, 5) == 'page/'
            ) {
                continue;
            }
            if ($filter & self::FILTER_SLICE
                && substr($parts[1], 0, 6) == 'slice/'
            ) {
                continue;
            }
                
            $ns = str_replace(DIRECTORY_SEPARATOR, '\\', substr($parts[0], 1));
            if (!isset($found[$ns])) {
                $found[$ns] = array();
            }
            $parts[1] = substr($parts[1], 0, -4);
            $found[$ns]["$ns\\{$parts[1]}"] = $parts[1];
        }
        ksort($found);
        foreach ($found as &$ns) {
            asort($ns);
        }
        return $found;
    }
}

