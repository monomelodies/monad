<?php

namespace monad\core;
use monad\admin\Language_Access;

class I18n_Form extends Form implements Language_Access
{
    public static $IDENTIFIER;
    public $languagetabs = true;

    public function multilanguage($identifier, $field)
    {
        $self = $this;
        $fields = call_user_func(function() use($self) {
            foreach ($self as $field => $value) {
                $fields[$field] = $value;
            }
            foreach (array_keys($fields) as $field) {
                unset($self[$field]);
            }
            return $fields;
        });
        foreach ($fields as $field => $value) {
            if (in_array($field, func_get_args())) {
                foreach ($this->projectlanguage->available as $lang) {
                    if (!isset(static::$IDENTIFIER)) {
                        static::$IDENTIFIER = "{$identifier}[{$lang->id}]";
                        $this->addHidden("{$identifier}[{$lang->id}]");
                    }
                    $f = clone $value;
                    $f->setOption('name', "{$field}[{$lang->id}]");
                    $f->setOption('id', $f::nameToId($f->getOption('name')));
                    $f->setClass(implode(' ', array_unique(array_merge(
                        explode(' ', $f->getOption('class')),
                        ['language', $lang->code]
                    ))));
                    $this["{$field}[{$lang->id}]"] = $f;
                }
            } else {
                $this[$field] = $value;
            }
        }
    }

    public function addI18nSource($sources)
    {
        if (!isset($sources)) {
            return;
        }
        $data = [];
        foreach ($sources as $source) {
            if (!isset($source['language'])) {
                continue;
            }
            $language = $source['language'];
            foreach ($source as $name => $value) {
                if ($name == 'language') {
                    continue;
                }
                $data["{$name}[$language]"] = $value;
            }
        }
        $this->addSource($data);
    }
}

