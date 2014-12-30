<?php

namespace monad\admin;
use monad\core\I18n_Form;
use Adapter_Access;

class Section_Form extends I18n_Form
{
    use Language_Access;
    use Adapter_Access;

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
    
    public function __construct()
    {
        parent::__construct();
        $language = self::projectlanguage()->available[0];
        $this->addForeignKey(
            'page',
            $this->text(['./page', 'column/page']),
            [
                'package' => 'monad',
                'target' => 'page',
                'field' => 'title',
            ]
        )->isRequired();
        $this->addForeignKey(
            'owner',
            $this->text(['./owner', 'column/owner']),
            [
                'package' => 'monad',
                'target' => 'auth',
                'field' => 'name',
            ]
        )->isRequired();
        $this->addNumeric(
            'sortorder',
            $this->text(['./sortorder', 'column/sortoder'])
        )->isRequired();
        foreach (self::projectlanguage()->available as $lang) {
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
        foreach (self::projectlanguage()->available as $lang) {
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
                Section_Model::$allowed['status']
            )->setClass("language {$lang->code}");
        }
        */
        $this->addText('viewname', $this->text('./viewname'));
        $this->languagetabs = true;
        return parent::prepare();
    }
}

