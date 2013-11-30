<?php

namespace monad;
use monolyth;

class Delete_Form extends monolyth\core\Post_Form
{
    public function __construct(monolyth\core\Form $form = null)
    {
        foreach ($form as &$field) {
            $this->addField(
                new monolyth\ui\Info($field->getName()),
                $field->getLabel()
            );
        }
        $this->addSource($form);
        parent::__construct();
        $this->buttons = array();
        $this->addButton(self::BUTTON_SUBMIT, 'Ja');
        $this->addButton(self::BUTTON_CANCEL, 'Terug');
    }
}
