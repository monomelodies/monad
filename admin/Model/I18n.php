<?php

namespace monad\admin;
use monad\core\Form;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\render\form\Info;
use ErrorException;

trait I18n_Model
{
    public function saveI18n(Form $form, $table, $i18n = null)
    {
        try {
            $id = $this['id'];
        } catch (ErrorException $e) {
            $id = null;
        }
        $normals = [];
        $i18ns = [];
        if (!isset($i18n)) {
            $i18n = "{$table}_i18n";
        }
        foreach ($form as $name => $value) {
            if ($value instanceof Info) {
                continue;
            }
            if (preg_match("@^(\w+)\[(\d+)\]$@", $name, $match)) {
                if (!isset($i18ns[$match[2]])) {
                    $i18ns[$match[2]] = [];
                }
                $i18ns[$match[2]][$match[1]] = $value->value;
            } else {
                $normals[$name] = $value->value;
            }
        }
        $changed = 0;
        if ($normals) {
            try {
                if ($id) {
                    self::adapter()->update($table, $normals, compact('id'));
                } else {
                    self::adapter()->insert($table, $normals);
                    $id = self::adapter()->lastInsertId();
                }
                ++$changed;
            } catch (UpdateNone_Exception $e) {
            } catch (InsertNone_Exception $e) {
                return 'insert';
            }
        }
        foreach ($i18ns as $language => $data) {
            if (!$data) {
                continue;
            }
            try {
                self::adapter()->update(
                    $i18n,
                    $data,
                    compact('id', 'language')
                );
                ++$changed;
            } catch (UpdateNone_Exception $e) {
                try {
                    self::adapter()->field($i18n, 1, compact('id', 'language'));
                } catch (NoResults_Exception $e) {
                    try {
                        self::adapter()->insert(
                            $i18n,
                            $data + compact('id', 'language')
                        );
                    } catch (InsertNone_Exception $e) {
                        return 'inserti18n';
                    }
                }
                ++$changed;
            }
        }
        $this->load(self::adapter()->row(
            "$table JOIN $i18n USING(id)",
            '*',
            ['id' => $id, 'language' => self::language()->current->id]
        ));
        return $changed ? null : 'nochange';
    }
}

