<?php

namespace monad\admin;
use monad\core\Tabular_Inline;
use monad\core\Model;

class Inline_Item_Menu_Model extends Model implements Sortable, Tabular_Inline
{
    public function inlineLinks(Model $menu_or_item)
    {
        switch (get_class($menu_or_item)) {
            case 'monad\admin\Menu_Model':
                return http_build_query(['menu' => $menu_or_item['id']]);
            case 'monad\admin\Item_Menu_Model':
                return http_build_query([
                    'menu' => $menu_or_item['menu'],
                    'parent' => $menu_or_item['id'],
                ]);
        }
    }
}

