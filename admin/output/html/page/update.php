<?php

namespace monad\admin;
use monad\core\Checkboxes_Inline;
use monad\core\Stacked_Inline;
use monad\core\Tabular_Inline;
use ErrorException;

$renderInline = function($title, $items) use($model, $view, $self) {
    $args = compact('title', 'items') + ['parent' => $model];
    if (!is_array($items)) {
        if ($items instanceof Stacked_Inline) {
            $class = get_class($items);
            $class = preg_replace('@[a-zA-Z_]*?Inline_(.*?)_Model@', '\\1_Form', $class);
            $args += ['formClass' => $class];
            echo $view('inline/stacked', $args);
        } elseif (!($self instanceof Create_Controller)) {
            echo $view('inline/create', $args);
        }
        return;
    }
    if ($items[0] instanceof Stacked_Inline) {
        $class = get_class($items[0]);
        $class = preg_replace('@[a-zA-Z_]*?Inline_(.*?)_Model@', '\\1_Form', $class);
        $args += ['formClass' => $class];
        echo $view('inline/stacked', $args);
    } elseif ($items[0] instanceof Tabular_Inline) {
        echo $view('inline/tabular', $args);
    } elseif ($items[0] instanceof Checkboxes_Inline) {
        echo $view('inline/checkboxes', $args);
    } else {
        echo $view('inline', $args);
    }
};

$txt = $text('monad\admin\back');
$uri = null;
if (isset($_GET['redir'])) {
    $uri = urldecode($_GET['redir']);
} elseif (isset($actions['list'])) {
    $uri = $actions['list'];
}
$sub = $self instanceof View_Controller ? 'view' : 'update';
$sub = $self instanceof Create_Controller ? 'create' : $sub;
$title = $text(["./$sub/title", './title', "$sub/title", __NAMESPACE__."\\$sub/title"]);
if (isset($uri)) {
    echo $boxHead(
        $boxIcons($title, '<a href="'.$uri.'" class="up" title="'.htmlentities(strip_tags($txt)).'">'.$txt.'</a>'),
        '',
        ' update'
    );
} else {
    echo $boxHead($title, '', ' update');
}

?>
<form method="post" action="">
<?php

if ($model::INLINE_POSITION == 'before') {
    call_user_func(function($inlines) use($renderInline) {
        foreach ($inlines as $title => $items) {
            $renderInline($title, $items);
        }
    }, $inlines);
}
$buttons = false;
if ($form->languagetabs) {

?>
    <div class="monad_tabs_menu">
<?php foreach ($projectlanguage->available as $i => $lang) { ?>
        <a href="#tab-<?=$lang->code?>"<?=$i ? '' : ' class="active"'?>><?=$lang->title?></a>
<?php } ?>
    </div>
    
<?php

}
echo $view(
    ['monolyth\render\form\table'],
    compact('form', 'buttons', 'class')
);
if ($model::INLINE_POSITION == 'after') {
    call_user_func(function($inlines) use($renderInline) {
        foreach ($inlines as $title => $items) {
            $renderInline($title, $items);
        }
    }, $inlines);
}

if ($btns = $form->getButtons()) {

?>
<div class="buttons">
<?php

    foreach ($btns as $btn) {
        echo "$btn\n";
    }

?>
    <hr>
</div>
<?php } ?>
</form>
<?=$boxFoot()?>

<?php if (isset($form->editors) && $form->editors) { ?>
<script>
Monolyth.scripts.push(function() {
<?php

    foreach ($form->editors as $field => $editor) {
        $args = compact('package', 'target', 'field');
        try {
            if (strlen($form[$form::$IDENTIFIER]->value)) {
                $args += ['override' => $form[$form::$IDENTIFIER]->value];
            }
            $editor['contentsCss'] = $url('monad/admin/wysiwyg_style', $args);
            $editor['bodyId'] = $editor['bodyClass'] = $form[$form::$IDENTIFIER]->value;

?>
        $('textarea.html.<?=$field?>').monadEditor('<?=$language->current->code?>', <?=json_encode($editor)?>);
<?php

        } catch (ErrorException $e) {
        }
    }

?>
});
</script>
<?php

}
return compact('title', 'scripts');

