<?php

namespace monad;
// Set the EDITING constant to true so we can check for various stuff.
const EDITING = true;

namespace monad\core;
use monolyth;
use monolyth\DependencyContainer;
use monolyth\User_Access;
use monolyth\utils\Translatable;
use monolyth\core;
use monolyth\Session_Access;
use ArrayObject;
use ErrorException;
use monad;
use monad\Admin;
use monolyth\Config;
use monolyth\HTTP301_Exception;
use monolyth\render\FileNotFound_Exception;
use monolyth\render\Static_Helper;

abstract class Controller extends core\Controller
implements User_Access, Session_Access
{
    use Translatable;
    use Static_Helper;

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
    public function __construct(DependencyContainer $container)
    {
        parent::__construct($container);
        $user = $this->user;
        $redir = $this->http->getRedir();
        $this->modules->all();
        $this->mainmenu = $this->user->loggedIn() ?
            $this->admins->find() :
            null;
        $this->menubottom = [];
        if ($this->user->loggedIn()) {
            $this->menubottom['logout'] = [
                $this->url('monad/admin/logout'),
                method_exists($this, 'text') ?
                    $this->text('monad\admin\logout') :
                    'Logout',
            ];
        }
        foreach ($this->language->available as $lang) {
            $this->menubottom[$lang->code] = [
                "/monad/{$lang->code}/",
                $lang->title
            ];
        }
        $this->template = $this->view([
            'monad\admin\template/body',
            'monolyth\template/page',
        ]);
        $user = $this->user;
        $redir = $this->http->getRedir();
        $language = $this->language;
        $acl = $user->acl;
        $this->addRequirement(
            'monad\admin\Login_Required',
            $user->loggedIn()
                && $acl->using('monad')->can($acl::READ),
            function() use($redir, $language) {
                call_user_func($this->logout);
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
        $this->attach([
            'menumodules' => $this->menumodules,
            //'menutop' => $this->menutop,
            'menumain' => $this->mainmenu,
            'menubottom' => $this->menubottom,
            'sidebar' => $this->sidebar,
            'querysaver' => $this->querysaver,
            'scripts' => [],
            'texts' => $this->texts->all(),
        ]);
        call_user_func(function() {
            $options = [];
            try {
                $options = include 'config/sites.php';
            } catch (ErrorException $e) {
                $myproject = $this->myproject;
                $options[$this->project['http']] = $myproject['name'];
            }
            $this->siteselect->prepare(
                'pick',
                $options,
                ['id' => 'sites-pick']
            );
        });
        $extra = [];
        foreach (array_keys($this->modules->all()) as $name) {
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
        $acl = $this->user->acl;
        if ($this->user->loggedIn()
            && $acl->using('monad')->can($acl::READ)
        ) {
            $this->sidebar(
                self::MESSAGE_INFO,
                $this->text(
                    'monad\admin\login/success',
                    $this->user->name()
                )
            );
        }
        try {
            $this->head = $this->view('monad\admin\slice/head');
        } catch (FileNotFound_Exception $e) {
        }
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

