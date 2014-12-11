<?php

namespace monad\admin;
use ErrorException;
use monolyth\HTTP404_Exception;

switch ($type) {
    case 'css':
        try {
            $find = function($path) {
                $paths = explode(PATH_SEPARATOR, get_include_path());
                foreach ($paths as $prefix) {
                    if (substr($prefix, -1) == DIRECTORY_SEPARATOR) {
                        $prefix = substr($prefix, 0, -1);
                    }
                    $try_path = sprintf(
                        "%s%s%s",
                        $prefix,
                        DIRECTORY_SEPARATOR,
                        $path
                    );
                    if (file_exists($try_path)) {
                        return($try_path);
                    }
                }
                return null;
            };
            if ($real = $find($filename)) {
                $type = getimagesize($real)['mime'];
            } else {
                throw new HTTP404_Exception();
            }
        } catch (ErrorException $e) {
            $type = 'text/css';
        }
        break;
    case 'js': $type = 'text/javascript'; break;
}
header("Content-type: $type", true);
readfile($filename, true);
die();

