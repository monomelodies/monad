<?php

namespace monad\admin;
use monad\Menuitem_Model;
use monolyth\User_Access;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;

class Item_Menu_Model extends Model implements User_Access
{
    use I18n_Model;

    const STATUS_HIDDEN = Menuitem_Model::STATUS_HIDDEN;
    const STATUS_HOME = Menuitem_Model::STATUS_HOME;
    const STATUS_BLANK = Menuitem_Model::STATUS_BLANK;

    public static $allowed = ['status' => [
        self::STATUS_HIDDEN => 'hidden',
        self::STATUS_HOME => 'home',
        self::STATUS_BLANK => 'blank',
    ]];

    public function inlines()
    {
        return ['items'];
    }

    public function save(Item_Menu_Form $form)
    {
        $changed = 0;
        if (!($error = $this->saveI18n($form, 'monad_menu_item'))) {
            $changed++;
        }
        if (!isset($this['id'])) {
            return $error;
        }
        $id = $this['id'];
        try {
            $this->adapter->update(
                'monad_menu_item',
                [
                    'usermodified' => $this->user->id(),
                    'datemodified' => $this->adapter->now(),
                ],
                compact('id')
            );
        } catch (UpdateNone_Exception $e) {
        }
        return $changed ? null : $error;
    }
    
    public function delete()
    {
        try {
            $this->adapter->delete('monad_menu_item', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'database';
        }
    }
}

