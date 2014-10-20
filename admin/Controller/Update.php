<?php

namespace monad\admin;
use monolyth\HTTP301_Exception;
use monolyth\HTTP404_Exception;
use monad\core\Scaffold_Controller;

class Update_Controller extends Scaffold_Controller
{
    use Helper;

    protected function get(array $args)
    {
        unset($args['language']);
        $args['key'] = $this->parseKey($args['key']);
        if (!($this->model = $this->finder->find($args['key']))) {
            throw new HTTP404_Exception;
        }
        $inlines = [];
        foreach ($this->model->inlines() as $fn) {
            $inlines[$fn] = $this->finder->$fn(
                $this->model,
                self::language()->current->id
            );
            $propname = preg_replace_callback(
                "@(ie)?s$@",
                function($match) {
                    if (isset($match[1]) && $match[1] == 'ie') {
                        return 'y';
                    }
                    return '';
                },
                $fn
            );
            $this->$propname = !is_object($inlines[$fn]) ?
                $inlines[$fn][0] :
                $inlines[$fn];
        }
        $this->form->addSource($this->model);
        if (method_exists($this->finder, 'languageData')) {
            $languages = $this->finder->languageData($args['key']);
            $this->form->addI18nSource($languages);
        } else {
            $languages = null;
        }
        $this->form->load();
        $actions = $this->actions;
        $finder = $this->finder;
        if ($this->form->hideEmptyFields) {
            $this->form->hideEmptyFields();
        }
        return $this->view(
            __NAMESPACE__.'\update',
            compact('languages', 'actions', 'finder', 'inlines')
                + $args + $inlines
        );
    }

    protected function post(array $args)
    {
        $view = $this->get($args);
        if (!$this->form->errors()) {
            $error = $this->model->save($this->form);
            if (isset($_POST['inline'])) {
                foreach ($_POST['inline'] as $object => $data) {
                    if (isset($this->$object)) {
                        $class = get_class($this->$object);
                        $class = preg_replace(
                            '@[a-zA-Z_]*?Inline_(.*?)_Model@',
                            '\\1_Form',
                            $class
                        );
                        $propname = substr($object, -1) == 'y' ?
                            substr($object, 0, -1).'ies' :
                            "{$object}s";
                        $items = $view->data()['inlines'][$propname];
                        $base = $this->container->satisfy(new $class);
                        $i = 0;
                        foreach ($data as $key => $values) {
                            $form = clone $base;
                            $mc = get_class($this->$object);
                            $me = $this->container->satisfy(new $mc);
                            if (substr($key, 0, 3) == 'id_') {
                                $ids[] = substr($key, 3);
                                $values['id'] = substr($key, 3);
                                foreach ($items as $item) {
                                    if ($item['id'] == $values['id']) {
                                        $me->load((array)$item);
                                        break;
                                    }
                                }
                            }
                            $extra = [];
                            parse_str($this->model->inlineLinks($me), $extra);
                            $values = $extra + $values;
                            if ($me instanceof Sortable) {
                                $values['sortorder'] = ++$i;
                            }
                            $form->addSource($values)->prepare();
                            if (!($e = $me->save($form))
                                and $error == 'nochange'
                            ) {
                                $error = null;
                            }
                            if (isset($me['id'])) {
                                $ids[] = $me['id'];
                            }
                        }
                        if ($ids
                            and method_exists($this->$object, 'deleteExcept')
                            and (!($e = $this->$object->deleteExcept(
                                $this->model,
                                $ids
                            )))
                            and $error == 'nochange'
                        ) {
                            $error = null;
                        }
                    }
                }
            }
            if ($error) {
                self::message()->add(
                    'error',
                    $this->text(["./error.$error", "error.$error"])
                );
            } else {
                self::message()->add(
                    'success',
                    $this->text(['./success', 'success'])
                );
                throw new HTTP301_Exception(isset($_GET['redir']) ?
                    urldecode($_GET['redir']) :
                    self::http()->getSelf()
                );
            }
        }
        return $view;
    }
}

