<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;
use monolyth\HTTP404_Exception;
use monad\core;
use monolyth\utils\Translatable;
use monolyth\adapter\sql\Exception;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\adapter\sql\Adapter;
use Closure;
use monad\core\Scaffold_Controller;
use adapter\Access as Adapter_Access;

class Database_Controller extends Scaffold_Controller
{
    use Translatable;
    use Adapter_Access;

    protected function get(array $args)
    {
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
                    'monad/admin/list',
                    [
                        'database' => $databases[0],
                        'language' => self::language()->current->code,
                    ] + $args
                ));
        }
        unset($args['language']);
        return $this->view('page/databases', $args + compact('databases'));
    }
}

