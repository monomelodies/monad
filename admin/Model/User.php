<?php

namespace monad\admin;
use monad\core\Model;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\render\form\Info;
use monolyth\account\Pass_Model;

class User_Model extends Model
{
    public $requires = ['monad_auth'];

    public function save(User_Form $form)
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
        if (isset($data['pass'])) {
            $pass = new Pass_Model;
            $data['salt'] = null;
            if ($hash = $pass->hash()) {
                $data['salt'] = $pass->salt();
                $data['pass'] = "$hash:".hash(
                    $hash,
                    $data['pass'].$data['salt']
                );
            }
        }
        try {
            if ($id) {
                self::adapter()->update('monolyth_auth', $data, compact('id'));
            } else {
                self::adapter()->insert('monolyth_auth', $data);
                $id = self::adapter()->lastInsertId('monolyth_auth_id_seq');
                foreach (self::adapter()->rows(
                    'monolyth_group',
                    'id',
                    ['name' => ['IN' => ['Monad', 'Administrators']]]
                ) as $group) {
                    self::adapter()->insert(
                        'monolyth_auth_group',
                        ['auth' => $id, 'auth_group' => $group['id']]
                    );
                }
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
            self::adapter()->delete('monolyth_auth', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'delete';
        }
    }
}

