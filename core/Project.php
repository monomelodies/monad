<?php

namespace monad\core;
use Project as Myproject;

class Project extends Myproject
{
    protected $variables = 'monad/output/%%s/%s/variables.php';

    public function __construct($theme = 'default')
    {
        parent::__construct();
        $this->variables = sprintf($this->variables, $theme);
        $this->styles = [];
        $this['theme'] = $theme;
    }
}

