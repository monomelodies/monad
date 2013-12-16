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
use monad\admin\I18n_Model;

class {target}_Model extends Model
{
    use I18n_Model;

    public $requires = ['{tableguess}', '{tableguess}_i18n'];

    public function save({target}_Form $form)
    {
        $id = isset($this['id']) ? $this['id'] : null;
        if (!($error = $this->saveI18n($form, '{tableguess}'))) {
            return null;
        }
        return $error;
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

class {target}_Finder extends core\I18n_Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        $options += [
            'limit' => $size,
            'offset' => ($page - 1) * $size,
        ];
        try {
            return $this->adapter->pages(
                $this->table('{tableguess}', '{tableguess}_i18n')
               .sprintf(
                    " JOIN monolyth_language l ON %s = l.id ",
                    implode('', $this->fields([], 'language', false))
                ),
                $this->fields(
                    ['{tableguess}.*', 'l.title AS language_str'],
                    ['*']
                ),
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

    public function languageData(array $where)
    {
        try {
            return $this->adapter->rows('{tableguess}_i18n', '*', $where);
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
use monad\core\I18n_Form;
use monolyth\Language_Access;

class {target}_Form extends I18n_Form implements Language_Access
{
    public function prepare($id = null)
    {
        return parent::prepare($id);
    }
}


EOT
    ,
];

