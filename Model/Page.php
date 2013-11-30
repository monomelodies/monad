<?php

namespace monad;
use monolyth\core\Model;
use monolyth\Multilanguage_Model;
use monolyth\Pyramid_Model;
use monolyth\Owned_Model;
use monolyth\utils\Translatable;
use monolyth\render\Url_Helper;
use ErrorException;

class Page_Model extends Model
implements Multilanguage_Model, Pyramid_Model, Owned_Model
{
    use Translatable, Url_Helper {
        Url_Helper::url as _url;
    }

    const STATUS_HIDDEN = 1;
    const STATUS_HOME = 2;

    public function url()
    {
        if (isset($this['link'])) {
            $args = [];
            foreach (explode("\n", $this['params']) as $arg) {
                try {
                    list($key, $value) = explode(':', $arg, 2);
                } catch (ErrorException $e) {
                    continue;
                }
                $args[$key] = $value;
            }
            return $this->_url($this['link'], $args);
        }
        return $this->_url(
            'monad/static_page',
            ['slug' => $this['slug'] ? $this['slug'] : '']
        );
    }
}

