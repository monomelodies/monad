<?php

namespace monad;
use monolyth\Finder;
use monolyth\Language_Access;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\core\Singleton;
use Adapter_Access;

class Section_Finder implements Finder
{
    use Language_Access;
    use Adapter_Access;
    use Singleton;

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

