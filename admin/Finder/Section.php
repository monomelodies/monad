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
            return $this->adapter->pages(
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
            return null;
        }
    }

    public function find(array $where)
    {
        try {
            return $this->model->load($this->adapter->row(
                'monad_section',
                '*',
                $where
            ));
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function languageData(array $where)
    {
        try {
            return $this->adapter->rows('monad_section_i18n', '*', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function sections(Page_Model $page, $language)
    {
        try {
            return $this->adapter->models(
                $this->section,
                'monad_section s
                 JOIN monad_section_i18n i USING(id)
                 JOIN monad_page_section ps ON ps.section = s.id',
                [
                    's.id',
                    'i.header',
                ],
                [
                    'page' => $page['id'],
                    'i.language' => $language,
                ],
                ['order' => 'ps.sortorder ASC']
            );
        } catch (NoResults_Exception $e) {
            return $this->section;
        }
    }
}

