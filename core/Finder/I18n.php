<?php

namespace monad\core;
use monolyth\Language_Access;

abstract class I18n_Finder extends Finder
{
    use Language_Access;

    protected static $languages;

    protected function languages()
    {
        if (!isset(static::$languages)) {
            static::$languages = self::adapter()->rows(
                'monolyth_language',
                '*',
                [],
                ['order' => sprintf(
                    'id = %s DESC,
                     is_default = true DESC',
                    self::adapter()->quote(self::language()->current->id)
                )]
            );
        }
        return static::$languages;
    }

    protected function table($table, $i18n, $field = 'id')
    {
        $new = $table;
        foreach ($this->languages() as $language) {
            $new .= sprintf(
                " LEFT JOIN %1\$s AS i18n_%2\$d"
               ." ON %3\$s.%4\$s = i18n_%2\$d.%4\$s"
               ." AND i18n_%2\$d.language = '%2\$d'",
                $i18n,
                $language['id'],
                $table,
                $field
            );
        }
        return $new;
    }

    protected function fields($ignore, $fields, $as = true)
    {
        if (!is_array($fields)) {
            $fields = preg_split("@,\s+@", $fields);
        }
        $languages = $this->languages();
        foreach ($fields as &$field) {
            $subs = [];
            foreach ($languages as $language) {
                $subs[] = "i18n_{$language['id']}.$field";
            }
            $field = "COALESCE(".implode(', ', $subs).")"
                .($as ? " AS $field" : '');
        }
        if ($ignore && !is_array($ignore)) {
            $ignore = preg_split("@,\s+@", $ignore);
        }
        return array_merge($ignore ? $ignore : [], $fields);
    }

    abstract public function languageData(array $where);
}

