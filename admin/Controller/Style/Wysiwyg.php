<?php

namespace monad\admin;
use monad\core;
use ErrorException;

class Wysiwyg_Style_Controller extends core\Controller
{
    protected function get(array $args)
    {
        extract($args);
        header("Content-type: text/css");

        /**
         * As of version 2.0.1, this works differently:
         * - WYSIWYG styles are assumed to be defined under ./admin/public. They
         *   in turn could be generated using compass from ./admin/_sass or so.
         * - If the path (under admin/public) is e.g. foo/bar/baz.css, the proxy
         *   will attempt to concat the following files (in that order):
         *   foo.css, foo/bar.css and foo/bar/baz.css. This means your styles
         *   will always be rendered from least to most specific.
         * - Hence there usually is no need to @import anything in your .scss
         *   partias, except probably for the topmost one (foo.css in our
         *   example).
         */
        // Grab resets.
        /*
        foreach (['reset', 'html5'] as $file) {
            include "monad/admin/_sass/_$file.scss";
        }
        */
        // Grab custom fonts.
        try {
            ob_start();
            include 'template/fonts.php';
            echo str_replace(['<style>', '</style>'], '', ob_get_clean());
        } catch (ErrorException $e) {
            ob_end_clean();
        }
        $try = [$database, $package, $target, $field];
        if (isset($override)) {
            $try[] = $override;
        }
        $paths = [];
        while ($try) {
            $paths[] = array_shift($try);
            try {
                ob_start();
                include 'admin/public/'.implode('/', $paths).'.css';
                $css = ob_get_clean();
                $css = preg_replace_callback(
                    '/@import url\((.*?)\);/i',
                    function($match) {
                        /**
                         * @import statements in generated wysiwyg styles for
                         * MonAd are assumed to be relative to the include path,
                         * e.g. @import url(output/css/project.css);
                         */
                        try {
                            return file_get_contents($match[1], true);
                        } catch (ErrorException $e) {
                            return '';
                        }
                    },
                    $css
                );
                $css = preg_replace_callback(
                    "@url\((.*?)\)@i",
                    function($match) {
                        if (preg_match("@^https?://@", $match[1])
                            || $match[1]{0} == '/'
                        ) {
                            return $match[0];
                        }
                        return 'url(/css/'.$match[1].')';
                    },
                    $css
                );
                $cmd = sprintf(
                    "php %s %s/bin/variables css",
                    sprintf("-d include_path='%s'", get_include_path()),
                    realpath(__DIR__.'/../../../../monolyth')
                );
                $r = proc_open(
                    $cmd,
                    [['pipe', 'r'], ['pipe', 'w'], ['pipe', 'a']],
                    $pipes
                );
                foreach (str_split($css, 1024) as $line) {
                    fwrite($pipes[0], $line);
                }
                fclose($pipes[0]);
                echo stream_get_contents($pipes[1]);
                proc_close($r);
            } catch (ErrorException $e) {
            }
        }
        die();
    }
}

