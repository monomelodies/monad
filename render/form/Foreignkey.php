<?php

namespace monad\render\form;
use monolyth\render\form\Text;
use monolyth\adapter\sql\NoResults_Exception;
use Adapter_Access;

class Foreignkey extends Text
{
    use Adapter_Access;

    public $initial;
    protected $type = 'foreignkey';
    protected $renderOptions = ['id', 'name'];
    protected $data = null;
    private $settings;
    private $internalId;
    private $originalInternalId;

    public function prepare($name, array $settings, array $options = [])
    {
        parent::prepare($name, $options);
        $this->settings = $settings;
    }

    public function __set($name, $value)
    {
        if ($name != 'value') {
            return null;
        }
        if (!(isset($this->options['required'])
            && $this->options['required']
        )) {
            if ((is_array($value) && !$value)
                || (!is_array($value) && !strlen(trim($value)))
            ) {
                $value = null;
            }
        }
        $id = null;
        if ($value) {
            $id = $value;
            try {
                $value = self::adapter()->get(
                    $this->settings['table'],
                    $this->settings['field'],
                    compact('id')
                );
            } catch (NoResults_Exception $e) {
                $value = null;
            }
        }
        $this->original = $this->value;
        $this->originalInternalId = $this->internalId;
        $this->value = $value;
        $this->internalId = $id;
        unset($this->options[$name]);
        return $value;
    }
}

