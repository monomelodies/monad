<?php

namespace monad\core;
use monolyth\core\Post_Form;
use monolyth\render\form\Bitflags;
use monolyth\render\form\Radios;
use monad\render\form\Foreignkey;

abstract class Form extends Post_Form
{
    public $languagetabs = false, $hideEmptyFields = false;

    public function prepare($id = null)
    {
        $this->addSource($_GET);
        parent::prepare($id);
        $this->addButton(
            self::BUTTON_SUBMIT,
            $this->text(['./save', 'save', 'monad\admin\save'])
        );
        return $this;
    }

    protected function addForeignKey($name, $label, $load, $external)
    {
        $element = new Foreignkey;
        $element->setParent($this);
        if (!isset($label)) {
            $label = null;
        }
        if (!is_null($label)) {
            if ($this->placeholders) {
                $element->setPlaceholder($label);
            } else {
                $element->setLabel($label);
            }
        }
        $element->prepare($name, $load, $external);
        $element->prependFormname($this->getId());
        $this[$element->getName()] = $element;
        return $element;
    }

    public function hideEmptyFields()
    {
        $self = $this;
        $fields = [];
        call_user_func(function() use(&$self, &$fields) {
            foreach ($self as $key => $value) {
                if ($value instanceof Bitflags
                    || $value instanceof Radios
                ) {
                    continue;
                }
                if (!($value->value
                    && (is_array($value->value) ?
                        true :
                        strlen(trim($value->value))
                    )
                )) {
                    $fields[] = $key;
                }
            }
        });
        foreach ($fields as $key) {
            unset($this[$key]);
        }
    }

    protected function translateArray($array)
    {
        foreach ($array as &$value) {
            $value = $this->text("./$value");
        }
        return $array;
    }
}

