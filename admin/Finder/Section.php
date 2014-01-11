<?php

namespace monad\admin;
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;

class Section_Finder extends core\I18n_Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        $options += [
            'order' => 'ps.sortorder',
            'limit' => $size,
            'offset' => ($page - 1) * $size,
        ];
        try {
            return self::adapter()->pages(
                $this->table('monad_section', 'monad_section_i18n')
               .sprintf(
                    " JOIN monolyth_language l ON %s = l.id
                      JOIN monad_page_section ps ON
                        ps.section = monad_section.id ",
                    implode('', $this->fields([], 'language', false))
                ),
                $this->fields(
                    ['monad_section.id', 'l.title AS language_str'],
                    ['header']
                ),
                $where,
                $options
            );
        } catch (NoResults_Exception $e) {
            return new Section_Model;
        }
    }

    public function find(array $where)
    {
        try {
            return (new Section_Model)->load(self::adapter()->row(
                'monad_section',
                '*',
                $where
            ));
        } catch (NoResults_Exception $e) {
            return new Section_Model;
        }
    }

    public function languageData(array $where)
    {
        try {
            return self::adapter()->rows('monad_section_i18n', '*', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

