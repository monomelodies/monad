<?php

namespace monad\admin;
use monolyth\core;
use monolyth\adapter\sql\UpdateNone_Exception;
use monolyth\User_Access;

class Sort_Model extends core\Model implements User_Access
{
    public function reorder($id, $move, $menu, $parent)
    {
        $where = ['menu' => $menu];
        if ($parent) {
            $where += ['parent' => $parent];
        }
        $old = $this->items->sortorderData(compact('id'));
        try {
            self::adapter()->update(
                'monad_menu_item',
                [sprintf(
                    "sortorder = sortorder + %d",
                    $move
                )],
                compact('id')
            );
        } catch (UpdateNone_Exception $e) {
        }
        if ((int)$move > 0) { 
            try {
                self::adapter()->update(
                    'monad_menu_item',
                    ['sortorder = sortorder - 1'],
                    $where + [
                        'id' => ['!=' => $id],
                        [sprintf(
                            "sortorder BETWEEN %s AND %s", 
                            self::adapter()->quote($old['sortorder']), 
                            self::adapter()->quote($old['sortorder'] + $move)
                        )], 
                    ]
                );
            } catch (UpdateNone_Exception $e) {
                die($e);
            }
        } elseif ((int)$move < 0) {
            try {
                self::adapter()->update(
                    'monad_menu_item',
                    ['sortorder = sortorder + 1'],
                    $where + [
                        'id' => ['!=' => $id],
                        [sprintf(
                            "sortorder BETWEEN %s AND %s",
                            self::adapter()->quote($old['sortorder'] + $move),
                            self::adapter()->quote($old['sortorder'])
                        )],
                    ]
                );
            } catch (UpdateNone_Exception $e) {
            }
        }
    return null;
    }
}

