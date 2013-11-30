<?php

namespace monad\monad;
use monolyth\core, monolyth\db;

abstract class Inline extends Generic
{
    public $view = 'monad\core\page/model/inline';
    protected $model;
    protected $data = array();
    protected $choices = null;

    public function __construct(core\Model $parent, array $where)
    {
        parent::__construct($parent);
        $this->model = str_replace(
            array('\monad', '_Inline', '_Tabular'),
            array('\model', '', ''),
            get_class($this)
        );
        $model = new $this->model();
        $this->data = new core\model\Group($model);
        $options = array();
        if ($order = $model->getDefaultOrder()) {
            $options['order'] = $order;
        }
        if ($this->choices) {
            $options['limit'] = $this->choices;
        }
        try {
            $this->data->loadMonad($where, $options);
        } catch (db\sql\NoResults_Exception $e) {
        }
    }

    public function getModel()
    {
        return $this->model;
    }

    public function getData()
    {
        return $this->data;
    }
}

