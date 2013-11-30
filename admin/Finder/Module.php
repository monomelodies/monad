<?php

namespace monad\admin;
use monolyth;
use monolyth\Session_Access;
use ErrorException;

class Module_Finder implements monolyth\Finder, Session_Access
{
    public function all()
    {
        // Check available modules.
        $Modules = $this->session->get('Modules');
        if (true || !isset($Modules)) {
            clearstatcache();
            $Modules = [];
            $dirs = explode(PATH_SEPARATOR, get_include_path());
            foreach ($dirs as $dir) {
                try {
                    $d = Dir($dir);
                } catch (ErrorException $e) {
                    continue;
                }
                while (false !== ($entry = $d->read())) {
                    if ($entry{0} == '.') {
                        continue;
                    }
                    try {
                        $Modules[$entry] = parse_ini_file(
                            "$dir/$entry/info/meta.ini",
                            true
                        );
                    } catch (ErrorException $e) {
                    }
                }
            }
            ksort($Modules);
            $this->session->set(compact('Modules'));
        }
        return $Modules;
    }
}

