<?php

namespace monad\core;
use monolyth\Finder;
use monolyth\Language_Access;
use monolyth\utils\Translatable;

class Text_Finder implements Finder
{
    use Translatable;
    use Language_Access;

    public function all()
    {
        $texts = [
            'monad\\admin\\deleteconfirm' => '',
            'monad\\admin\\selectforeignkey' => '',
        ];
        foreach ($texts as $id => &$text) {
            $text = [$id, self::language()->current->code];
        }
        $this->text->load($texts);
        foreach ($texts as $id => &$text) {
            $text = [
                $id,
                $this->text->retrieve($id, self::language()->current->code)
            ];
        }
        return array_values($texts);
    }
}

