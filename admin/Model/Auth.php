<?php

namespace monad\admin;
use monad\core\Model;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\render\form\Info;

class Auth_Model extends Model
{
    public $requires = ['monad_auth'];

    public function save(Auth_Form $form)
    {
        $id = isset($this['id']) ? $this['id'] : null;
        $data = [];
        foreach ($form as $key => $value) {
            if ($value instanceof Info) {
                continue;
            }
            $data[$key] = $value->value;
        }
        if (!$data) {
            return null;
        }
        try {
            if ($id) {
                self::adapter()->update('monad_auth', $data, compact('id'));
            } else {
                self::adapter()->insert('monad_auth', $data);
            }
        } catch (InsertNone_Exception $e) {
            return 'insert';
        } catch (UpdateNone_Exception $e) {
            return 'nochange';
        }
        return null;
    }

    public function delete()
    {
        try {
            self::adapter()->delete('monad_auth', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'delete';
        }
    }
}

