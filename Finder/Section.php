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
            $language = self::language()->current->id;
        }
        try {
            return self::adapter()->rows(
                'monad_section s
                 JOIN monad_section_i18n i USING(id)
                 JOIN monad_page_section l ON section = s.id',
                '*',
                compact('page', 'language'),
                ['order' => 'sortorder ASC']
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

