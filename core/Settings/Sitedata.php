<?php

namespace monad\core;
use Monolyth;

class Sitedata_Settings extends \Sitedata_Settings
{
    public function __construct()
    {
        parent::__construct();
        global $site;
        $language = Monolyth::get('language');
        if (!isset($this->monad)) {
            $this->monad = array(
                'http' => $this->{$site}['http'],
                'name' => $this->{$site}['name'],
                //'pathimg' => $this->{$site}['pathimg'],
                'protocol' => $this->{$site}['protocol'],
            );
            if (isset($this->{$site}['https'])) {
                $this->monad['https'] = $this->{$site}['https'];
            }
            if (isset($this->{$site}['protocols'])) {
                $this->monad['protocols'] = $this->{$site}['protocols'];
            }
        }
    }
}

?>
