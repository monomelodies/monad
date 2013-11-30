<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;

class Create_Controller extends Update_Controller
{
    public function get(array $args)
    {
        unset($args['language']);
        $inlines = $this->model->inlines();
        if ($inlines) {
            foreach ($inlines as $group) {
                if (is_array($group)
                    && $group['items']
                    && $group['model'] instanceof Sortable
                ) {
                    $name = "sort[{$group['reference']['target']}]";
                    $data = [];
                    foreach ($group['items'] as $item) {
                        $data[] = [$item['id'], $item['sortorder']];
                    }
                    $this->form->addSource([$name => json_encode($data)]);
                }
            }
        }
        $this->form->load();
        $actions = $this->actions;
        $finder = $this->finder;
        $model = $this->model;
        return $this->view(
            __NAMESPACE__.'\page/create',
            compact('actions', 'finder', 'inlines', 'model') + $args
        );
    }
}

