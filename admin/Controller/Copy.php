<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;

class Copy_Controller extends Update_Controller
{
    protected function get(array $args)
    {
        unset($args['language']);
        $args['key'] = $this->parseKey($args['key']);
        $this->model = $this->finder->find($args['key']);
        $inlines = [];
        foreach ($this->model->inlines() as $fn) {
            $inlines[$fn] = $this->finder->$fn($this->model);
        }
        $this->form->addSource($this->model);
        if (method_exists($this->finder, 'languageData')) {
            $languages = $this->finder->languageData($args['key']);
            $this->form->addI18nSource($languages);
        } else {
            $languages = null;
        }
        $this->form->load();
        $actions = $this->actions;
        $finder = $this->finder;
        if ($this->form->hideEmptyFields) {
            $this->form->hideEmptyFields();
        }
        return $this->view(
            __NAMESPACE__.'\update',
            compact('languages', 'actions', 'finder', 'inlines')
                + $args + $inlines
        );
    }

    protected function post(array $args)
    {
        $view = $this->get($args);
        if (!$this->form->errors()) {
            if ($error = $this->model->save($this->form)) {
                self::message()->add(
                    'error',
                    $this->text(["./error.$error", "error.$error"])
                );
            } else {
                self::message()->add(
                    'success',
                    $this->text(['./success', 'success'])
                );
                throw new HTTP301_Exception(self::http()->getSelf());
            }
        }
        return $view;
    }
}

