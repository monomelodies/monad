<?php

namespace monad\admin;
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;

class Page_Finder extends core\I18n_Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        $options += [
            'order' => $this->fields('', ['title'], false),
            'limit' => $size,
            'offset' => ($page - 1) * $size,
        ];
        try {
            return self::adapter()->pages(
                $this->table('monad_page', 'monad_page_i18n')
               .sprintf(
                    " JOIN monolyth_language l ON %s = l.id ",
                    implode('', $this->fields([], 'language', false))
                ),
                $this->fields(
                    ['monad_page.id', 'l.title AS language_str'],
                    ['title']
                ),
                $where,
                $options
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function find(array $where)
    {
        try {
            return (new Page_Model)->load(self::adapter()->row(
                'monad_page',
                '*',
                $where
            ));
        } catch (NoResults_Exception $e) {
            return new Page_Model;
        }
    }

    public function languageData(array $where)
    {
        try {
            return self::adapter()->rows('monad_page_i18n', '*', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function sections(Page_Model $page, $language)
    {
        return (new Section_Finder)->all(
            100,
            1,
            ['language' => $language, 'page' => $page['id']]
        );
    }
}

