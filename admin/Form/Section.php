<?php

namespace monad\admin;
use monad\core\I18n_Form;
use monolyth\adapter;

class Section_Form extends I18n_Form implements Language_Access, adapter\Access
{
    public static $IDENTIFIER;

    public $editors = [
        'header' => [
            'toolbar' => 'Basic',
            'height' => '150px',
        ],
        'content' => [
            'toolbar' => 'Full',
            'height' => '300px',
        ],
        'footer' => [
            'toolbar' => 'Basic',
            'height' => '150px',
        ]
    ];
    
    public function prepare()
    {
        $model = $this->model;
        $language = $this->projectlanguage->available[0];
        foreach ($this->projectlanguage->available as $lang) {
            if (!isset(self::$IDENTIFIER)) {
                self::$IDENTIFIER = "header[{$lang->id}]";
            }
            $this->addTextHTML("header[{$lang->id}]", $this->text('./header'))
                 ->setClass("html header language {$lang->code}");
            $this->addTextHTML("content[{$lang->id}]", $this->text('./content'))
                 ->setClass("html content language {$lang->code}");
            $this->addTextHTML("footer[{$lang->id}]", $this->text('./footer'))
                 ->setClass("html footer language {$lang->code}");
        }
        /*
        $this->addForeignkey(
            'parent',
            $this->text(['./parent', 'column/parent']),
            function() use($language) {
                return self::adapter()->pages(
                    'monad_page_i18n',
                    ['id', 'title'],
                    ['language' => $language->id],
                    ['order' => 'LOWER(title) ASC', 'limit' => 30]
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monad_page_i18n',
                'field' => 'title',
                'id' => 'id',
                'where' => ['language' => $language->id],
                'order' => 'LOWER(title) ASC',
                'limit' => 10,
            ]
        )->null();
        $this->addForeignkey(
            'owner',
            $this->text('./owner'),
            function() {
                return self::adapter()->pages(
                    'monad_auth',
                    ['id', 'name'],
                    [],
                    ['order' => 'LOWER(name) ASC', 'limit' => 30]
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monolyth_auth',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(name) ASC'
                'limit' => 10,
            ]
        )->isRequired();
        foreach ($this->projectlanguage->available as $lang) {
            $this->addTextHTML("content[{$lang->id}]", $this->text('./content'))
                 ->setClass("html content language {$lang->code}");
            $this->addText("keywords[{$lang->id}]", $this->text('./keywords'))
                 ->setClass("language {$lang->code}");
            $this->addTextarea(
                "description[{$lang->id}]",
                $this->text('./description')
            )->setClass("language {$lang->code}");
            $this->addBitflags(
                "status[{$lang->id}]",
                $this->text('./status'),
                $model::$allowed['status']
            )->setClass("language {$lang->code}");
        }
        */
        $this->addText('viewname', $this->text('./viewname'));
        $this->languagetabs = true;
        return parent::prepare();
    }
}

