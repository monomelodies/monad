<?php

namespace monad\admin;
use monad\core\I18n_Form;
use monolyth\adapter;

class Menu_Form extends I18n_Form implements Language_Access, adapter\Access
{
    public static $IDENTIFIER;

    public function prepare()
    {
        $model = $this->model;
        $language = $this->projectlanguage->available[0];
        foreach ($this->projectlanguage->available as $lang) {
            $this->addText(
                "title[{$lang->id}]",
                $this->text(['./title', 'column/title'])
            )->setClass("language {$lang->code}");
        }
        $this->addHidden('sort[menu_item]');
        $this->addForeignkey(
            'owner',
            $this->text(['./owner', 'column/owner']),
            function() {
                return $this->adapter->pages(
                    'monolyth_auth',
                    ['id', 'name'],
                    [],
                    ['order' => 'LOWER(name) ASC', 'limit' => 30]
                );
            },
            [
                'adapter' => $this->adapter,
                'table' => 'monolyth_auth',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(name) ASC',
                'limit' => 10,
            ]
        )->isRequired();
        $this->addBitflags(
            'status',
            $this->text(['./status', 'column/status']),
            $model::$allowed['status']
        );
        $this->addButton(
            self::BUTTON_SUBMIT,
            $this->text(['./save', 'save', 'monad\admin\save'])
        );
        $this->languagetabs = true;
        return parent::prepare();
    }
}

