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
        $this->options['data-package'] = $settings['package'];
        $this->options['data-target'] = $settings['target'];
        $this->options['data-field'] = $settings['field'];
        $this->renderOptions[] = 'data-package';
        $this->renderOptions[] = 'data-target';
        $this->renderOptions[] = 'data-field';
    }

    private function classname()
    {
        $namespace = "{$this->settings['package']}\\admin\\";
        $parts = array_reverse(explode('_', $this->settings['target']));
        foreach ($parts as &$part) {
            $part = ucfirst($part);
        }
        $class = $namespace.implode('/', $parts);
        return "{$class}_Finder";
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
            $class = $this->classname();                
            $finder = new $class;
            if ($model = $finder->find(compact('id'))) {
                $value = $model[$this->settings['field']];
            } else {
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

