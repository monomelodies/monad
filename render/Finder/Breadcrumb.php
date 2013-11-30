<?php

namespace monad\render;
use monolyth\render;

class Breadcrumb_Finder extends render\Breadcrumb_Finder
{
    public function all(array $args)
    {
        return parent::all($args) + [
            $this->url('monad\Static_Page',
                ['slug' => $args['page']['slug']]
            ) => $args['page']['slug'],
        ];
    }
}
