<?php

namespace monad\Page;
use monolyth\adapter\sql\NoResults_Exception;
use disclosure\Injector;

class Service
{
    use Injector;

    public function __construct()
    {
        $this->inject('adapter');
    }

    public function all(array $where = [], $options = [])
    {
        $page = new Model;
        $where += [
            sprintf(
                "monad_page_i18n.status & '%d'",
                $page::STATUS_HIDDEN
            ) => 0,
            'monad_page_i18n.language' => self::language()->current->id,
            'd.language' => self::language()->default->id,
        ];
        try {
            return $this->adapter->models(
                $page,
                'monad_page
                 JOIN monad_page_i18n USING(id)
                 JOIN monad_page_i18n d USING(id)
                 LEFT JOIN monad_page p ON p.id = monad_page.parent',
                [
                    'monad_page.*',
                    'monad_page_i18n.*',
                    'd.slug AS default_slug',
                    sprintf(
                        "fn_assembleslug(monad_page.id, %s) AS slug",
                        $this->adapter->quote(self::language()->current->id)
                    ),
                ],
                $where,
                $options + ['order' => 'COALESCE(p.sortorder, 0) ASC,
                                        monad_page.sortorder ASC']
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function find($language, $slug)
    {
        $stmt = $this->adapter->prepare(
            "SELECT
                p.*,
                i.*,
                fn_assembleslug(p.id, l.id) slug
             FROM monad_page p
                JOIN monad_page_i18n i USING(id)
                JOIN monolyth_language_all l ON l.id = i.language
             WHERE i.slug = ?
                AND l.code = ?
                AND status & ? = 0"
        );
        $stmt->execute([
            $slug,
            $language,
            Model::STATUS_HIDDEN,
        ]);
        $page = $stmt->fetchObject('monad\Page\Model');
        return $page;
        try {
            $page->load($this->adapter->row(
                'monad_page JOIN monad_page_i18n USING(id)',
                [
                    '*',
                    sprintf(
                        "fn_assembleslug(monad_page.id, %s) AS slug",
                        $this->adapter->quote($language)
                    ),
                ],
                [
                    sprintf(
                        'id IN (
                            SELECT id FROM monad_page_i18n WHERE slug = %s
                        )',
                        $this->adapter->quote($slug)
                    ),
                    'language' => $language,
                    sprintf("status & '%d'", $page::STATUS_HIDDEN) => 0,
                ]
            ));
            return $page;
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function slug(array $where)
    {
        try {
            return $this->adapter->field(
                'monad_page p JOIN monad_page_i18n i USING(id)',
                'slug',
                $where
            );
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function home($language = null)
    {
        if (!isset($language)) {
            $language = self::language()->current->id;
        }
        $page = new Page_Model;
        try {
            $page->load($this->adapter->row(
                'monad_page JOIN monad_page_i18n USING(id)',
                [
                    '*',
                    sprintf(
                        "fn_assembleslug(monad_page.id, %s) AS slug",
                        $this->adapter->quote($language)
                    ),
                ],
                [
                    'language' => $language,
                    sprintf(
                        "status & '%d'",
                        $page::STATUS_HIDDEN | $page::STATUS_HOME
                    ) => $page::STATUS_HOME,
                ]
            ));
            return $page;
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

