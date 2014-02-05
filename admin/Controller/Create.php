<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;
use monolyth\adapter\sql\Adapter;
use Adapter_Access;
use monolyth\HTTP404_Exception;

class Create_Controller extends Update_Controller
{
    use Adapter_Access;

    public function get(array $args)
    {
        extract($args);
        if (!isset($database)) {
            $databases = [];
            foreach (self::adapters() as $name => $db) {
                if ($db instanceof Closure) {
                    $db = $db();
                }
                if ($name == '_current' || !($db instanceof Adapter)) {
                    continue;
                }
                // Check if adapter actually supplies required tables.
                $requireds = 0;
                foreach ($this->model->requires as $table) {
                    try {
                        $db->field($table, 1, []);
                        $requireds++;
                    } catch (NoResults_Exception $e) {
                        $requireds++;
                    } catch (Exception $e) {
                    }
                }
                if ($requireds == count($this->model->requires)) {
                    $databases[] = $name;
                }
            }
            switch (count($databases)) {
                case 0:
                    throw new HTTP404_Exception;
                case 1:
                    throw new HTTP301_Exception($this->url(
                        'monad/admin/create',
                        [
                            'package' => $args['package'],
                            'target' => $args['target'],
                            'database' => $databases[0],
                        ]
                    ));
                default:
                    return $this->view(
                        'page/databases',
                        $args + compact('databases')
                    );
            }
        }
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

