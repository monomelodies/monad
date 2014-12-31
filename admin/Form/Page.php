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
        $language = self::projectlanguage()->available[0];
        foreach (self::projectlanguage()->available as $lang) {
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
            [
                'package' => 'monad',
                'target' => 'page',
                'field' => 'title',
            ]
        )->null();
        $this->addForeignkey(
            'owner',
            $this->text('./owner'),
            [
                'package' => 'monad',
                'target' => 'auth',
                'field' => 'name',
            ]
        )->isRequired();
        foreach (self::projectlanguage()->available as $lang) {
            $this->addTextHTML("content[{$lang->id}]", $this->text('./content'))
                 ->setClass("html content language {$lang->code}");
            $this->addTextarea("keywords[{$lang->id}]", $this->text('./keywords'))
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

