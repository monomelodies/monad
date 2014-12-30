<?php

namespace monad\admin;
use monad\core\Model;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\render\form\Info;

class Section_Model extends Model
{
    use I18n_Model;

    public $requires = ['monad_section', 'monad_section_i18n'];

    public function save(Section_Form $form)
    {
        $page = $form['page']->value;
        $sortorder = $form['sortorder']->value;
        unset($form['page'], $form['sortorder']);
        if ($error = $this->saveI18n($form, 'monad_section')) {
            return $error;
        }
        try {
            self::adapter()->delete(
                'monad_page_section',
                [
                    'section' => $this['id'],
                    'page' => $page,
                ]
            );
        } catch (DeleteNone_Exception $e) {
        }
        try {
            self::adapter()->insert(
                'monad_page_section',
                [
                    'section' => $this['id'],
                    'page' => $page,
                    'sortorder' => $sortorder,
                ]
            );
        } catch (InsertNone_Exception $e) {
            return 'link';
        }
        return null;
    }

    public function delete()
    {
        try {
            self::adapter()->delete('monad_section', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'delete';
        }
    }

    public function inlineLinks($model)
    {
        if ($model instanceof Page_Model) { 
            try {
               $sortorder = self::adapter()->field(
                    'monad_page_section',
                    'sortorder + 1',
                    ['page' => $model['id']],
                    ['order' => 'sortorder DESC']
                );
            } catch (NoResults_Exception $e) {
                $sortorder = 1;
            }
            return http_build_query([
                'page' => $model['id'],
                'sortorder' => $sortorder,
            ], '', '&amp;');
        }
    }
}

