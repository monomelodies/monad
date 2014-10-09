<?php

namespace monad\admin;
use monolyth\Finder;
use monolyth\Session_Access;
use ErrorException;
use monolyth\core\Singleton;

class Module_Finder implements Finder
{
    use Session_Access;
    use Singleton;

    public function all()
    {
        // Check available modules.
        $Modules = self::session()->get('Modules');
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
            self::session()->set(compact('Modules'));
        }
        return $Modules;
    }
}

