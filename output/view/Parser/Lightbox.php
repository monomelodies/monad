<?php

namespace monad\view;
use monolyth\view;

class Lightbox_Parser extends view\Parser
{
    public function __invoke($html, array $names, $rel = 'lightbox')
    {
        $body = $this->body($html);
        $match = '('.implode('|', $names).')';
        $body = preg_replace(
            "@<img(.*?)src=\"$match\"@msi",
            '<img$1 rel="'.$rel.'" src="$2"',
            $body
        );
        return $this->html($body);
    }
}

