<?php

namespace monad\admin;
use monad\admin\Model;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\render\form\Info;

class Section_Model extends Model
{
    use I18n_Model;

    public $requires = ['monad_section', 'monad_section_i18n'];

    public function save(Section_Form $form)
    {
        return $this->saveI18n($form, 'monad_section');
    }

    public function delete()
    {
        try {
            $this->adapter->delete('monad_section', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'delete';
        }
    }
}

