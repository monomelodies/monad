<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;

class View_Controller extends Update_Controller
{
    public function get(array $args)
    {
        $view = parent::get($args);
        foreach ($this->form as $field) {
            $field->disabled();
        }
        $this->form->clearButtons();
        $this->form->hideEmptyFields();
        return $view;
    }

    protected function post(array $args)
    {
        throw new HTTP403_Exception();
    }
}

