<?php

namespace monad\render\form;
use monolyth\render\form\Text;
use monolyth\adapter\sql\NoResults_Exception;
use Adapter_Access;
use monolyth\Language_Access;

class Foreignkey extends Text
{
    use Adapter_Access;
    use Language_Access;

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
        foreach (self::adapters() as $name => $adapter) {
            if ($name != '_current' && $adapter == self::adapter()) {
                $this->options['data-database'] = $name;
                $this->renderOptions[] = 'data-database';
                break;
            }
        }
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
                if (method_exists($model, 'saveI18n')) {
                    $props = (array)$model;
                    foreach ($finder->languageData(compact('id')) as $lang) {
                        if ($lang['language'] = self::language()->current->id) {
                            $props += $lang;
                        }
                    }
                    $value = $props[$this->settings['field']];
                } else {
                    $value = $model[$this->settings['field']];
                }
            } else {
                $value = null;
            }
        }
        $this->original = $this->value;
        $this->originalInternalId = $this->internalId;
        $this->value = $value;
        if ($value) {
            $this->renderOptions[] = 'value';
            $this->renderOptions[] = 'data-value';
            $this->options['data-value'] =& $this->internalId;
        }
        $this->internalId = $id;
        unset($this->options[$name]);
        return $value;
    }

    public function __get($name)
    {
        if ($name != 'value') {
            return null;
        }
        return $this->internalId;
    }
}

