<?php

namespace monad\admin;
use monad\Page_Model as Base;
use monad\core;
use monolyth\adapter\sql\InsertNone_Exception;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\adapter\sql\DeleteNone_Exception;
use monolyth\User_Access;
use monolyth\render\Extract_Media;

class Page_Model extends core\Model implements User_Access
{
    use I18n_Model, Extract_Media;

    const STATUS_HIDDEN = Base::STATUS_HIDDEN;
    const STATUS_HOME = Base::STATUS_HOME;

    public $requires = ['monad_page', 'monad_page_i18n'];
    public static $allowed = [
        'status' => [
            self::STATUS_HIDDEN => ':t:hidden',
            self::STATUS_HOME => ':t:home',
        ],
    ];

    public function save(Page_Form $form)
    {
        $medias = [];
        foreach ($form as $key => $el) {
            if (substr($key, 0, 7) == 'content') {
                $el->value = $this->all($el->value, $medias);
            }
        }
        if (!($error = $this->saveI18n($form, 'monad_page'))) {
            $status = 0;
            foreach ((array)$this as $key => $value) {
                if (substr($key, 0, 6) == 'status') {
                    $status |= $value;
                }
            }
            $new = 0;
            foreach ($form as $key => $el) {
                if (substr($key, 0, 6) == 'status'
                    && $el->value != $status
                ) {
                    $new |= $el->value;
                }
            }
            if (($new & self::STATUS_HOME) != ($status & self::STATUS_HOME)) {
                if ($new & self::STATUS_HOME) {
                    try {
                        $this->adapter->update(
                            'monad_page_i18n',
                            [sprintf(
                                "status = status & ~%d",
                                self::STATUS_HOME
                            )],
                            ['id' => ['<>' => $this['id']]]
                        );
                    } catch (UpdateNone_Exception $e) {
                    }
                    try {
                        $this->adapter->update(
                            'monad_page_i18n',
                            [sprintf(
                                "status = status | %d",
                                self::STATUS_HOME
                            )],
                            ['id' => $this['id']]
                        );
                    } catch (UpdateNone_Exception $e) {
                    }                
                } else {
                    try {
                        $this->adapter->update(
                            'monad_page_i18n',
                            [sprintf(
                                "status = status & ~%d",
                                self::STATUS_HOME
                            )],
                            ['id' => $this['id']]
                        );
                    } catch (UpdateNone_Exception $e) {
                    }
                }
            }
            try {
                $this->adapter->update(
                    'monad_page',
                    [
                        'usermodified' => $this->user->id(),
                        'datemodified' => $this->adapter->now(),
                    ],
                    ['id' => $this['id']]
                );
            } catch (UpdateNone_Exception $e) {
            }
            return null;
        }
        return $error;
    }

    public function delete()
    {
        try {
            $this->adapter->delete('monad_page', ['id' => $this['id']]);
            return null;
        } catch (DeleteNone_Exception $e) {
            return 'database';
        }
    }
}

