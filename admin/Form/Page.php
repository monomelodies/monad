<?php

namespace monad\admin;
use monad\core\I18n_Form;
use Adapter_Access;

class Page_Form extends I18n_Form
{
    use Language_Access;
    use Adapter_Access;

    public static $IDENTIFIER;

    public $editors = [
        'content' => [
            'toolbar' => 'Full',
            'height' => '300px',
        ]
    ];

    public function __construct()
    {
        parent::__construct();
        $language = $this->projectlanguage->available[0];
        foreach ($this->projectlanguage->available as $lang) {
            if (!isset(self::$IDENTIFIER)) {
                self::$IDENTIFIER = "slug[{$lang->id}]";
            }
            $this->addText("title[{$lang->id}]", $this->text('./title'))
                 ->setClass("language {$lang->code}");
            $this->addText("slug[{$lang->id}]", $this->text('./slug'))
                 ->setClass("language {$lang->code}");
        }
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
                'order' => 'LOWER(name) ASC',
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
                Page_Model::$allowed['status']
            )->setClass("language {$lang->code}");
        }
        $this->languagetabs = true;
        return parent::prepare();
    }
}

