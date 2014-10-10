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
        $try = [$package, $target, $field];
        if (isset($override)) {
            $try[] = $override;
        }
        $paths = [];
        while ($try) {
            $paths[] = array_shift($try);
            try {
                echo preg_replace("@(^|\s)(html|body)@", '', preg_replace_callback(
                    "@url\((.*?)\)@i",
                    function($match) {
                        if (preg_match("@^https?://@", $match[1])
                            || $match[1]{0} == '/'
                        ) {
                            return $match[0];
                        }
                        return 'url(/css/'.$match[1].')';
                    },
                    file_get_contents(
                        'admin/public/'.implode('/', $paths).'.css',
                        true
                    )
                ));
            } catch (ErrorException $e) {
            }
        }
        die();
    }
}

