<?php

namespace monad\admin;
use monad\core;
use monolyth\adapter\sql\NoResults_Exception;

class Page_Finder extends core\I18n_Finder
{
    public function all($size, $page, array $where = [], array $options = [])
    {
        try {
            return $this->adapter->pages(
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
                [
                    'order' => $this->fields('', ['title'], false),
                    'limit' => $size,
                    'offset' => ($page - 1) * $size,
                ]
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function find(array $where)
    {
        $page = $this->model;
        try {
            $page->load($this->adapter->row('monad_page', '*', $where));
            return $page;
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function languageData(array $where)
    {
        try {
            return $this->adapter->rows('monad_page_i18n', '*', $where);
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

