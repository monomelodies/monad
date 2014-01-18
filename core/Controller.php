<?php

namespace monad;
// Set the EDITING constant to true so we can check for various stuff.
const EDITING = true;

namespace monad\core;
use monolyth\DependencyContainer;
use monolyth\User_Access;
use monolyth\utils\Translatable;
use monolyth\core;
use monolyth\Session_Access;
use ArrayObject;
use ErrorException;
use monad\admin;
use monolyth\Config;
use monolyth\HTTP301_Exception;
use monolyth\HTTP404_Exception;
use monolyth\render\FileNotFound_Exception;
use monolyth\render\Static_Helper;
use monolyth\render\form\Select;
use monad\admin\Module_Finder;
use monolyth\render\Css;
use monolyth\render\Script;
use monolyth\Project_Access;
use monolyth\Text_Model;
use monolyth\render\Translate_Parser;
use monolyth\account\Logout_Model;
use monolyth\Language_Access;

abstract class Controller extends core\Controller
{
    use Translatable;
    use Static_Helper;
    use User_Access;
    use Session_Access;
    use Project_Access {
        Project_Access::project as myproject;
    }
    use admin\Language_Access;

    public
        /** Sidebar items (type + title + content). */
        $sidebar = [],
        /** Menuselection. */
        $menuselection = null,
        /** Querysaver. */
        $querysaver = null,
        /** Rendertime. */
        $rendertime = 0,
        /** Selected database. */
        $database = null,
        $menumodules = [];
    /** Default theme is, ehm, 'default'. */
    public static $theme = 'default';

    /** Constructor. */
    public function __construct()
    {
        parent::__construct();
        $this->Css = new Css;
        $this->Script = new Script;
        $user = self::user();
        $redir = self::http()->getRedir();
        $this->admins = new Menu_Finder;
        $this->mainmenu = $user->loggedIn() ? $this->admins->find() : null;
        $this->menubottom = [];
        if ($user->loggedIn()) {
            $this->menubottom['logout'] = [
                $this->url('monad/admin/logout'),
                method_exists($this, 'text') ?
                    $this->text('monad\admin\logout') :
                    'Logout',
            ];
        }
        foreach (self::language()->available as $lang) {
            $this->menubottom[$lang->code] = [
                "/monad/{$lang->code}/",
                $lang->title
            ];
        }
        $this->template = $this->view([
            'monad\admin\template/body',
            'monolyth\template/page',
        ]);
        $redir = self::http()->getRedir();
        $language = self::language();
        if (preg_match(
            '@^/monad/([a-z]{2})/@',
            $_SERVER['REQUEST_URI'],
            $match
        )) {
            $language->set($match[1]);
        }
        $this->addRequirement(
            'monad\admin\Login_Required',
            function() {
                if (!(self::user()->loggedIn()
                    && self::user()->inGroup('Monad')
                )) {
                    return false;
                }
                $uri = array_shift(explode('?', $_SERVER['REQUEST_URI']));
                $parts = explode('/', substr($uri, 1));
                foreach ($parts as $key => $value) {
                    if (!strlen($value)) {
                        unset($parts[$key]);
                    }
                }
                try {
                    $package = $parts[2];
                    $target = $parts[3];
                } catch (ErrorException $e) {
                    // No selection made yet, so we can't say anything
                    // sensible about permissions yet.
                    return true;
                }
                if ($item = $this->mainmenu->find("$package $target")) {
                    return $item->hasPermission();
                }
                return false;
            },
            function() use($redir, $language) {
                $logout = new Logout_Model;
                $logout();
                throw new HTTP301_Exception(
                    $this->url('monad/admin/login').'?redir='.urlencode($redir)
                );
            }
        );

        // (Re)set arrays.
        $this->style = [];
        /*
        $data = $this->text('monad\core\data');
        if (!($this->querysaver && $this->querysaver->querycount)) {
            try {
                unset($this->menutop[$data]['data-commit']);
            } catch (\ErrorException $e) {
            }
        }
        */
        // Fill the sidebar.
        $texts = new Text_Finder;
        $texts->text = new Text_Model($this);
        $this->template->data([
            'menumodules' => $this->menumodules,
            //'menutop' => $this->menutop,
            'menumain' => $this->mainmenu,
            'menubottom' => $this->menubottom,
            'sidebar' => $this->sidebar,
            'querysaver' => $this->querysaver,
            'scripts' => [],
            'texts' => $texts->all(),
            'projectlanguage' => self::projectlanguage(),
        ]);
        $this->template->addParser(new Translate_Parser);
        call_user_func(function() {
            $options = [];
            try {
                $options = include 'config/sites.php';
            } catch (ErrorException $e) {
                $myproject = self::project();
                $options[$myproject['http']] = $myproject['name'];
            }
            $this->siteselect = new Select;
            $this->siteselect->prepare(
                'pick',
                $options,
                ['id' => 'sites-pick']
            );
        });
        $extra = [];
        $modules = new Module_Finder;
        foreach (array_keys($modules->all()) as $name) {
            try {
                fclose(fopen("$name/output/css/admin.css", "r", true));
                $extra[] = "$name/output/css/admin.css";
            } catch (ErrorException $e) {
            }
        }
        try {
            fclose(fopen("output/css/admin.css", "r", true));
            $extra[] = "output/css/admin.css";
        } catch (ErrorException $e) {
        }
        if ($extra) {
            call_user_func_array([$this->Css, 'push'], $extra);
        }
        $this->attach(['siteselect' => $this->siteselect]);
        if (self::user()->loggedIn()) {
            $this->sidebar(
                'info',
                $this->text(
                    'monad\admin\login/success',
                    self::user()->name()
                )
            );
        }
        try {
            $this->head = $this->view('monad\admin\slice/head');
        } catch (FileNotFound_Exception $e) {
        }
    }

    public static function project()
    {
        static $project;
        if (!isset($project)) {
            $project = new Project;
        }
        return $project;
    }

    /**
     * Destructor overload. End() the querysaver.
     *
     * @see Monad_CommitController::_commit
     * @see Querysaver::end
    public function __destruct()
    {
        if (monad\User::loggedIn() && $this->querysaver) {
            $this->querysaver->end();
        }
        parent::__destruct();
    }
     */

    protected function sidebar($type, $content)
    {
        $o =& $this->sidebar[];
        $o = new \StdClass();
        $o->type = $type;
        $o->content = $content;
    }

    private function buildFilelist()
    {
        $files = [];
        $paths = explode(PATH_SEPARATOR, get_include_path());
        $project = monad\Project::instance();
        foreach ($paths as $path) {
            foreach (['model', 'view'] as $subdir) {
                if (file_exists("{$project['private']}$path/$subdir")) {
                    if (!isset($files[$subdir])) {
                        $files[$subdir] = [];
                    }
                    $files[$subdir] += monolyth\utils\FileSystem::getfiles(
                        "{$project['private']}$path/$subdir",
                        -1,
                        ".*?$subdir.inc.php"
                    );
                }
            }
        }
        $_SESSION['_files_'] = $files;
    }

    protected function checkExpiry($date, $etag)
    {
        // Don't cache from within Monad.
        return 1;
    }
}

