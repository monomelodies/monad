<?php

namespace monad\Section;

use Disclosure\Injector;
use PDO;

class Service
{
    use Injector;

    protected $adapter;

    public function __construct()
    {
        $this->inject('adapter');
    }

    public function all($language, $slug)
    {
        $stmt = $this->adapter->prepare(
            "SELECT s.*, i.* FROM
                monad_section s
                JOIN monad_section_i18n i USING(id)
                JOIN monad_page_section l ON l.section = s.id
                JOIN monad_page_i18n pi ON pi.language = i.language
                    AND pi.id = l.page
                JOIN monolyth_language_all la ON la.id = i.language
             WHERE pi.slug = ? AND la.code = ?
             ORDER BY l.sortorder ASC"
        );
        $stmt->execute([$slug, $language]);
        $sections = $stmt->fetchAll(PDO::FETCH_CLASS, 'monad\Section\Model');
        return $sections ? $sections : null;
    }
}

