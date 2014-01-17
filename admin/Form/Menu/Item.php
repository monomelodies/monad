<?php

namespace monad\admin;
use monad\core\I18n_Form;
use Adapter_Access;

class Item_Menu_Form extends I18n_Form
{
    use Language_Access;
    use Adapter_Access;

    public static $IDENTIFIER;

    public function __construct()
    {
        parent::__construct();
        $language = self::projectlanguage()->available[0];
        $this->addForeignkey(
            'owner',
            $this->text(['./owner', 'column/owner']),
            [
                'package' => 'monolyth',
                'target' => 'auth',
                'field' => 'name',
            ]
        )->isRequired();
        $this->addForeignkey(
            'menu',
            $this->text(['./menu', 'column/menu']),
            [
                'package' => 'monad',
                'target' => 'menu',
                'field' => 'title',
            ]
        )//->filter('parent')
         ->isRequired();
        $this->addForeignkey(
            'parent',
            $this->text(['./parent', 'column/parent']),
            [
                'package' => 'monad',
                'target' => 'menu_item',
                'field' => 'title',
            ]
        );
        $this->addNumeric(
            'sortorder',
            $this->text(['./sortorder', 'column/sortorder'])
        );
        foreach (self::projectlanguage()->available as $lang) {
            $this->addText(
                "title[{$lang->id}]",
                $this->text(['./title', 'column/title'])
            )->setClass("language {$lang->code}");
        }
        $this->addForeignkey(
            'page',
            $this->text(['./page', 'column/page']),
            [
                'package' => 'monad',
                'target' => 'page',
                'field' => 'title',
            ]
        );
        $this->addText('link', $this->text(['./link', 'column/link']));
        $this->addText('params', $this->text(['./params', 'column/params']));
        foreach (self::projectlanguage()->available as $lang) {
            $this->addText(
                "i18nparams[{$lang->id}]",
                $this->text(['./i18nparams', 'column/i18nparams'])
            )->setClass("language {$lang->code}");
            $this->addBitflags(
                "status[{$lang->id}]",
                $this->text(['./status', 'column/status']),
                $this->translateArray(Item_Menu_Model::$allowed['status'])
            )->setClass("language {$lang->code}");
        }
        $this->addInfo(
            'datecreated',
            $this->text(['./datecreated', 'column/datecreated'])
        );
        $this->languagetabs = true;
        return parent::prepare();
    }
}

