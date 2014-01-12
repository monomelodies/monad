<?php

namespace monad\render\form;
use monolyth\render\form\Text;
use monolyth\adapter\sql\NoResults_Exception;

class Foreignkey extends Text
{
    public $initial;
    protected $type = 'foreignkey',
              $renderOptions = ['id', 'name'],
              $data = null;

    public function prepare($name, callable $fn, array $d, array $o = [])
    {
        parent::prepare($name, $o);
        $this->data = $d;
        try {
            $this->initial = $fn();
        } catch (NoResults_Exception $e) {
            $this->initial = null;
        }
    }

    public function data()
    {
        return $this->data;
    }

    public function filter($elname)
    {
        $this->setOption('data-filter', $elname);
        return $this;
    }
}

