<?php

namespace monad\controller;
use monad\UserAbstract as User;

class Ajax extends \monolyth\controller\ControllerAbstract
{
    public function __construct()
    {
        // note: we manually check for logged-inness, since an Ajax response
        // auto-redirecting to the login-page wouldn't make much sense.
        if (!User::logged_in()) {
            die(json_encode(array('success' => false)));
        }
        parent::__construct();
    }

    public function actionDefault($object, $action, $param)
    {
        switch ($object) {
            case 'foreignkey':
                $o = new $_POST['model']();
                $dir = $param == 'next' ? '>' : '<';
                $items = $o['loadGroup'](
                    array('name' => array($dir => $_POST['current'])),
                    array(
                        'order' => array(array($dir == '>' ?
                            'asc' : 'desc' => 'name')),
                        'limit' => 50,
                    )
                );
                $response = array();
                foreach ($items as $value) {
                    $response[] = array(
                        'value' => $value->id,
                        'str' => $value->name,
                    );
                }
                echo json_encode($response);
                break;
        }
    }
}

