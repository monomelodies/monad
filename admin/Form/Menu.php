<?php

namespace monad\admin;
use monad\core\I18n_Form;
use Adapter_Access;

class Menu_Form extends I18n_Form
{
    use Language_Access;
    use Adapter_Access;

    public static $IDENTIFIER;

    public function __construct()
    {
        $language = self::projectlanguage()->available[0];
        foreach (self::projectlanguage()->available as $lang) {
            $this->addText(
                "title[{$lang->id}]",
                $this->text(['./title', 'column/title'])
            )->setClass("language {$lang->code}");
        }
        $this->addHidden('sort[menu_item]');
        $this->addForeignkey(
            'owner',
            $this->text(['./owner', 'column/owner']),
            [
                'package' => 'monolyth',
                'target' => 'auth',
                'field' => 'name',
            ]
        )->isRequired();
        $this->addBitflags(
            'status',
            $this->text(['./status', 'column/status']),
            Menu_Model::$allowed['status']
        );
        $this->addButton(
            self::BUTTON_SUBMIT,
            $this->text(['./save', 'save', 'monad\admin\save'])
        );
        $this->languagetabs = true;
        return parent::prepare();
    }
}

