<?php

namespace monad\admin;
use monad\core\I18n_Form;
use Adapter_Access;

class Item_Menu_Form extends I18n_Form
{
    use Language_Access;
    use Adapter_Access;

    public static $IDENTIFIER;

    public function prepare()
    {
        $model = $this->model;
        $language = $this->projectlanguage->available[0];
        $this->addForeignkey(
            'owner',
            $this->text(['./owner', 'column/owner']),
            function() {
                return self::adapter()->rows(
                    'monad_auth',
                    ['id', 'name'],
                    [],
                    ['order' => 'LOWER(name) ASC']
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monad_auth',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(name) ASC',
                'limit' => 10,
            ]
        )->isRequired();
        $this->addForeignkey(
            'menu',
            $this->text(['./menu', 'column/menu']),
            function() {
                return self::adapter()->rows(
                    'monad_menu m JOIN monad_menu_i18n i USING(id)',
                    ['id', 'title'],
                    ['language' => self::language()->current->id],
                    ['order' => 'LOWER(title) ASC']
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monad_menu',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(title) ASC',
                'limit' => 10,
            ]
        )->filter('parent')
         ->isRequired();
        $this->addForeignkey(
            'parent',
            $this->text(['./parent', 'column/parent']),
            function() {
                return self::adapter()->rows(
                    'monad_menu_item i
                     JOIN monad_menu_item_i18n ii USING(id)
                     LEFT JOIN monad_page_i18n p ON p.id = i.page',
                    ['i.id', 'COALESCE(ii.title, p.title) AS title', 'menu'],
                    [
                        'ii.language' => self::language()->current->id,
                        [
                            'p.language' => self::language()->current->id,
                            ['p.language IS NULL'],
                        ],
                    ],
                    ['order' => 'LOWER(COALESCE(ii.title, p.title)) ASC']
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monad_menu',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(title) ASC',
                'limit' => 10,
            ]
        );
        $this->addNumeric(
            'sortorder',
            $this->text(['./sortorder', 'column/sortorder'])
        );
        foreach ($this->projectlanguage->available as $lang) {
            $this->addText(
                "title[{$lang->id}]",
                $this->text(['./title', 'column/title'])
            )->setClass("language {$lang->code}");
        }
        $this->addForeignkey(
            'page',
            $this->text(['./page', 'column/page']),
            function() {
                return self::adapter()->rows(
                    'monad_page p JOIN monad_page_i18n i USING(id)',
                    ['id', 'title'],
                    ['language' => self::language()->current->id],
                    ['order' => 'LOWER(title) ASC']
                );
            },
            [
                'adapter' => self::adapter(),
                'table' => 'monad_menu',
                'field' => 'name',
                'id' => 'id',
                'where' => [],
                'order' => 'LOWER(title) ASC',
                'limit' => 10,
            ]
        );
        $this->addText('link', $this->text(['./link', 'column/link']));
        $this->addText('params', $this->text(['./params', 'column/params']));
        foreach ($this->projectlanguage->available as $lang) {
            $this->addText(
                "i18nparams[{$lang->id}]",
                $this->text(['./i18nparams', 'column/i18nparams'])
            )->setClass("language {$lang->code}");
            $this->addBitflags(
                "status[{$lang->id}]",
                $this->text(['./status', 'column/status']),
                $this->translateArray($model::$allowed['status'])
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

