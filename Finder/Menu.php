<?php

namespace monad;
use monolyth\Finder;
use monolyth\core\Singleton;
use monolyth\render\Menu;
use Adapter_Access;
use monolyth\Language_Access;
use monolyth\adapter\sql\NoResults_Exception;

class Menu_Finder implements Finder
{
    use Singleton;
    use Language_Access;
    use Adapter_Access;

    public function find($where)
    {
        try {
            $q = self::adapter()->row(
                'monad_menu JOIN monad_menu_i18n USING(id)',
                '*',
                $where + ['language' => self::language()->current->id]
            );
            $q2 = self::adapter()->rows(
                'monad_menu_item m
                 JOIN monad_menu_item_i18n i USING(id)
                 LEFT JOIN monad_page p ON m.page = p.id
                 LEFT JOIN monad_page_i18n pi ON p.id = pi.id
                    AND pi.language = i.language',
                [
                    'm.*',
                    'i.*',
                    'fn_assembleslug(p.id, i.language) AS slug',
                    "COALESCE(i.title, pi.title) AS title",
                    'pi.status AS pagestatus',
                ],
                [
                    'menu' => $q['id'],
                    'i.language' => self::language()->current->id,
                    sprintf(
                        "i.status & '%d'",
                        Menuitem_Model::STATUS_HIDDEN
                    ) => 0,
                    [
                        [sprintf(
                            "pi.status & '%d'",
                            Page_Model::STATUS_HIDDEN
                        ) => 0],
                        ['pi.status' => null],
                    ]
                ],
                ['order' => 'm.sortorder']
            );
            $items = [];
            foreach ($q2 as $row) {
                $row['language'] = self::language()->get($row['language'])->code;
                $items["{$row['id']} {$row['title']}"] = $row;
            }
            return (new Menu)->build($items);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function main()
    {
        return $this->find(['status' => Menu_Model::STATUS_MAIN]);
    }
}

