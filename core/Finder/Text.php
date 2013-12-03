<?php

namespace monad\core;
use monolyth\Finder as Base;
use monolyth\Language_Access;
use monolyth\utils\Translatable;

class Text_Finder implements Base, Language_Access
{
    use Translatable;

    public function all()
    {
        $texts = [
            'monad\\admin\\deleteconfirm' => '',
        ];
        foreach ($texts as $id => &$text) {
            $text = [$id, $this->language->current->code];
        }
        $this->text->load($texts);
        foreach ($texts as $id => &$text) {
            $text = [
                $id,
                $this->text->retrieve($id, $this->language->current->code)
            ];
        }
        return array_values($texts);
    }
}

