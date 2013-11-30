<?php

namespace monad;
use monolyth\Finder;
use monolyth\adapter;
use monolyth\Language_Access;
use monolyth\adapter\sql\NoResults_Exception;

class Section_Finder implements Finder, adapter\Access, Language_Access
{
    public function all($page, $language = null)
    {
        if (!isset($language)) {
            $language = $this->language->current->id;
        }
        try {
            return $this->adapter->rows(
                'monad_section s
                 JOIN monad_section_i18n i USING(id)
                 JOIN monad_section_link_page l ON section = s.id',
                '*',
                compact('page', 'language'),
                array('order' => 'sortorder ASC')
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

