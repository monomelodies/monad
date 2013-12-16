<?php

return [
    'Model' => <<<'EOT'
<?php

namespace {namespace};
use monad\core\Model;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\render\form\Info;

class {target}_Model extends Model
{
    public $requires = ['{tableguess}'];

    public function save({target}_Form $form)
    {
        $id = isset($this['id']) ? $this['id'] : null;
        $data = [];
        foreach ($form as $key => $value) {
            if ($value instanceof Info) {
                continue;
            }
            $data[$key] = $value->value;
        }
        if (!$data) {
            return null;
        }
        try {
            if ($id) {
                $this->adapter->update('{tableguess}', $data, compact('id'));
            } else {
                $this->adapter->insert('{tableguess}', $data);
            }
        } catch (InsertNone_Exception $e) {
            return 'insert';
        } catch (UpdateNone_Exception $e) {
            return 'nochange';
        }
        return null;
    }

    public function delete()
    {
        try {
            $this->adapter->delete('{tableguess}', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'delete';
        }
    }
}


EOT
    ,
    'Finder' => <<<'EOT'
<?php

namespace {namespace};
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;

class {target}_Finder extends core\Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        $options += [
            'limit' => $size,
            'offset' => ($page - 1) * $size,
        ];
        try {
            return $this->adapter->pages(
                '{tableguess}',
                '*',
                $where,
                $options
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function find(array $where)
    {
        try {
            return $this->model->load($this->adapter->row(
                '{tableguess}',
                '*',
                $where
            ));
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}


EOT
    ,
    'Form' => <<<'EOT'
<?php

namespace {namespace};
use monad\core\Form;

class {target}_Form extends Form
{
    public function prepare($id = null)
    {
        return parent::prepare($id);
    }
}


EOT
    ,
];

