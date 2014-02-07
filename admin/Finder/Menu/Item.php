<?php

namespace monad\admin;
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;

class Item_Menu_Finder extends core\I18n_Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        try {
            return self::adapter()->pages(
                $this->table('monad_menu_item', 'monad_menu_item_i18n')
               .sprintf(
                    " JOIN monolyth_language l ON %s = l.id ",
                    implode('', $this->fields([], 'language', false))
                ),
                $this->fields(
                    ['monad_menu_item.id', 'l.title AS language'],
                    ['title']
                ),
                $where,
                [
                    'order' => $this->fields('', ['title'], false),
                    'limit' => $size,
                    'offset' => ($page - 1) * $size,
                ]
            );
        } catch (NoResults_Exception $e) {
            return $this->model;
        }
    }

    public function find(array $where)
    {
        try {
            return (new Item_Menu_Model)->load(self::adapter()->row(
                'monad_menu_item',
                '*',
                $where
            ));
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function sortorderData(array $where) {
        try {
            return self::adapter()->row('monad_menu_item', 'sortorder', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
    
    public function languageData(array $where)
    {
        try {
            return self::adapter()->rows('monad_menu_item_i18n', '*', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function items(Item_Menu_Model $item, $language)
    {
        try {
            return self::adapter()->models(
                clone $item,
                'monad_menu_item m
                 JOIN monad_menu_item_i18n i USING(id)
                 LEFT JOIN monad_page_i18n p ON
                    p.id = m.page AND
                    p.language = i.language',
                [
                    'm.id',
                    'COALESCE(i.title', 'p.title) AS title',
                    'm.link',
                    'm.params',
                ],
                [
                    'menu' => $item['menu'],
                    'parent' => $item['id'],
                    'i.language' => $language,
                ],
                ['order' => 'm.sortorder ASC']
            );
        } catch (NoResults_Exception $e) {
            return new Item_Menu_Model;
        }
    }
}

