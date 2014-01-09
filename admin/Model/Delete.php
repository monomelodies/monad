<?php

namespace monad\admin;

trait Delete_Model
{
    public function delete()
    {
        $delete = $this->delete;
        if (!is_array($delete)) {
            $delete = [$delete];
        }
        $done = 0;
        foreach ($delete as $table => $id) {
            if (is_numeric($table)) {
                $table = $id;
                $id = 'id';
            }
            try {
                self::adapter()->delete($table, ['id' => $this[$id]]);
                $done++;
            } catch (DeleteNone_Exception $e) {
            }
        }
        return $done ? null : 'delete';
    }
}

