<?php

namespace monad\admin;
$Css->unshift(
    'monolyth/output/css/reset.css',
    'monolyth/output/css/html5.css',
    'monolyth/output/js/formalize/css/formalize.css',
    'monad/output/css/layout.css',
    "monad/output/css/{$project['theme']}/{$project['theme']}.css",
    'output/css/monad.css?'
);
$Script->unshift(
    'monolyth/output/js/formalize/js/jquery.formalize.js',
    'monolyth/output/js/jquery/ui.timepicker.js',
    'monolyth/output/js/jquery/validator.js',
    'monolyth/output/js/jquery/rangeinput.js',
    'monolyth/output/js/jquery/html5.js',
    'monolyth/output/js/monolyth.js',
    'monolyth/output/js/text.js',
    'monad/output/js/core.js'
);

?>
<body>
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
                $view(
                    'monolyth\render\slice/menu',
                    [
                        'items' => $menumain,
                        'headers_clickable' => false,
                        'id' => 'main',
                    ]
                ) :
                $view('slice/nomenu')?>
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
            <?=$view('monad\admin\slice/copyright')?>
        </li>
<?php if (isset($menubottom)) foreach ($menubottom as $id => $item) { ?>
        <li id="menu-<?=$id?>"><a href="<?=$item[0]?>" title="<?=$item[1]?>"><span><?=$item[1]?></span></a></li>
<?php } ?>
    </ul></footer>
    <script src="/monolyth/js/modernizr.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="/ckeditor/ckeditor.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
    <script src="/ckeditor/adapters/jquery.js"></script>
    <?=$Script?>
    <script>
        Monolyth.text.setup(<?=json_encode($texts)?>);
        Monolyth.scripts.execute();
    </script>
</body>
<?php return ['title' => $text(__NAMESPACE__.'\projectname')];

