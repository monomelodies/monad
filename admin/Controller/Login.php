<?php

namespace monad\admin;
use monad\core;
use monolyth\Logout_Required;
use monolyth\HTTP301_Exception;
use monolyth\utils\Translatable;

class Login_Controller extends core\Controller implements Logout_Required
{
    use Translatable, Helper;

    protected function get(array $args)
    {
        call_user_func($this->logout);
        $this->menumodules = $this->menutop = array();
        unset($this->menubottom['logout']);
        return $this->view('page/login');
    }

    protected function post(array $args)
    {
        $text = $this->text;
        if (!$this->form->errors()
            && !($error = $this->user->login($this->form))
        ) {
            $acl = $this->user->acl;
            if ($acl->using('monad')->can($acl::READ)) {
                if ($redir = $this->http->getRedir()) {
                    $redir = urldecode($redir);
                    if ($redir != $this->http->getSelf()) {
                        throw new HTTP301_Exception($redir);
                    }
                }
                throw new HTTP301_Exception($this->url('monad/admin'));
            }
            $this->message->add(
                self::MESSAGE_ERROR,
                $text('monad\user\login/error.denied')
            );
        } else {
            $this->message->add(
                self::MESSAGE_ERROR,
                $text('monolyth\account\login/error.credentials')
            );
        }
        return $this->get($args);
    }
}

