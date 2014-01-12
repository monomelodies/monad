<?php

namespace monad\core;

class Item_Model
{
    use Permission;

    private $url;
    private $txt;
    private $requires;

    public function __construct($url, $txt, $requires)
    {
        $this->url = $url;
        $this->txt = $txt;
        $this->requires = $requires;
    }

    public function __toString()
    {
        return $this->txt;
    }

    public function url()
    {
        return $this->url;
    }
}

