<?php

namespace monad\admin\login;
use monad\core;
use monolyth\Logout_Required;
use monolyth\HTTP301_Exception;
use monolyth\utils\Translatable;
use monolyth\account\Logout_Model;
use monolyth\account\Login_Form;
use monad\admin\Helper;

class Controller extends core\Controller implements Logout_Required
{
    use Translatable;
    use Helper;

    public function __construct()
    {
        parent::__construct();
        $this->form = new Login_Form;
    }

    protected function get(array $args)
    {
        $logout = new Logout_Model;
        $logout();
        $this->menumodules = $this->menutop = array();
        unset($this->menubottom['logout']);
        return $this->view('view');
    }

    protected function post(array $args)
    {
        if (!$this->form->errors()
            && !($error = self::user()->login($this->form))
        ) {
            if (self::user()->loggedIn()) {
                if ($redir = self::http()->getRedir()) {
                    $redir = urldecode($redir);
                    if ($redir != self::http()->getSelf()) {
                        throw new HTTP301_Exception($redir);
                    }
                }
                throw new HTTP301_Exception($this->url('monad/admin'));
            }
            self::message()->add(
                'error',
                'monad\user\login/error.denied'
            );
        } else {
            self::message()->add(
                'error',
                'monolyth\account\login/error.credentials'
            );
        }
        return $this->get($args);
    }
}

