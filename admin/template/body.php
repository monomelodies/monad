<?php namespace monad\admin ?>
<body<?=$self instanceof login\Controller ? ' class="valign"' : ''?>>
    <script>window.Monad = window.Monad || {}; window.Monad.language = '<?=$language->current->code?>'</script>
    <header id="header">
        <nav id="modules"><ul>
            <?=($uri = $url('monad/project')) ?
                '<li id="monolyth"><a href="'.$uri.'">MonoLyth Project</a></li>'."\n" :
                '' ?>
            <li id="monad"><a href="<?=$url('monad/admin')?>">MonAd</a></li>
<?php foreach ($menumodules as $id => $name) if ($uri = $url("$id/monad")) { ?>
            <li id="<?=$id?>"><a href="<?=$uri?>"><?=$name?></a></li>
<?php } // If it's turned off, ignore it. ?>
        </ul></nav>
<?php if ($user->loggedIn()) { ?>
        <form id="sites" method="get" action="<?=$url('monad/admin/redirect')?>" target="_blank"><fieldset>
            <?=$siteselect?>
            <button name="act_submit" value="sites" class="goto" type="submit">&raquo;</button>
        </fieldset></form>
<?php } ?>
    </header>
    <div id="wrap">
        <div id="menu-container">
            <a href="#">
                <span>&raquo;</span>
                <span>&laquo;</span>
            </a>
            <?=isset($menumain) ?
                $view('monad\admin\menu', ['menu' => $menumain]) :
                ($user->loggedIn() ? $view('nomenu') : '')?>
        </div>
        <aside id="sidebar">
<?php if ($msgs = $message->get()) foreach ($msgs as $msg) { ?>
            <div class="<?=$msg->type?>">
                <?=$msg->body?>
            </div>
<?php } ?>
        </aside>

        <section id="content"><div>
            <?=$content?>
        </div></section>
        <hr class="clear both">
    </div>

    <footer id="footer"><hr><ul>
        <li id="copyright">
            <?=$view('monad\admin\template/copyright')?>
        </li>
<?php if (isset($menubottom)) foreach ($menubottom as $id => $item) { ?>
        <li id="menu-<?=$id?>"><a href="<?=$item[0]?>" title="<?=$item[1]?>"><span><?=$item[1]?></span></a></li>
<?php } ?>
    </ul></footer>
    <script src="/monolyth/js/modernizr.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
    <script src="/js/monad/ckeditor/ckeditor.js"></script>
    <script src="/js/monad/ckeditor/adapters/jquery.js"></script>
    <script src="/js/monad/formalize/js/jquery.formalize.js"></script>
    <script src="/js/monolyth/jquery/ui.timepicker.js"></script>
    <script src="/js/monolyth/jquery/validator.js"></script>
    <script src="/js/monolyth/jquery/rangeinput.js"></script>
    <script src="/js/monolyth/jquery/html5.js"></script>
    <script src="/js/monolyth/monolyth.js"></script>
    <script src="/js/monolyth/text.js"></script>
    <script src="/js/monad/core.js"></script>
    <script>
        var Monad = Monad || {};
        Monad.language = '<?=$language->current->code?>';
    </script>
    <?=$Script?>
    <script>
        Monolyth.text.setup(<?=json_encode($texts)?>);
        Monolyth.scripts.execute();
    </script>
</body>
<?php return ['title' => $text(__NAMESPACE__.'\projectname')];

