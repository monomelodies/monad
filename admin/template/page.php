<?php

namespace monad\admin;
use ErrorException;

try {
    header("Content-type: text/html; charset=utf-8", true);
} catch (ErrorException $e) {
}
$title = isset($title) ? $title : [];
$title = is_array($title) ? $title : [$title];
if (isset($description) && is_array($description)) {
    $description = array_pop($description);
}

?>
<!doctype html>
<html class="no-js<?=$self instanceof login\Controller ? ' valign' : ''?>" lang="<?=$language->current->code?>">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><?=implode(' - ', $title)?></title>
    <meta name="generator" content="Monolyth 5.0.1">
<?php if (isset($keywords) && $keywords) { ?>
    <meta name="keywords" content="<?=htmlentities(implode(', ', $keywords))?>">
<?php } ?>
<?php if (isset($description) && $description) { ?>
    <meta name="description" content="<?=htmlentities($description)?>">
<?php } ?>
<?php if ($project['mobile-optimized']) { ?>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<?php } ?>
    <?=$view('monolyth\render\head')?>
    <style>
        @font-face {
            font-family: 'Strenuous';
            src: url('/css/admin/monad/default/font/strenuou-webfont.eot');
            src: local('☺'),
                 url('/css/admin/monad/default/font/strenuou-webfont.woff') format('woff'),
                 url('/css/admin/monad/default/font/strenuou-webfont.ttf') format('truetype'),
                 url('/css/admin/monad/default/font/strenuou-webfont.svg#webfontWb8YiIY1') format('svg');
            font-weight: normal;
            font-style: normal;
            }
    </style>
<?php foreach (Module_Finder::instance()->all() as $module => $data) { ?>
    <link rel="stylesheet" href="/css/admin/<?=$module?>/<?=$module?>.css">
<?php } ?>
    <link rel="stylesheet" href="/css/admin/monad/<?=$project['theme']?>/<?=$project['theme']?>.css">
<?php if (isset($Styles) && $Styles) foreach ($Styles as $style) { ?>
    <link rel="stylesheet" href="<?=$style?>">
<?php } ?>

<?php

if (isset($favicon)) {
    if (!is_array($favicon)) {
        $favicon = [$favicon];
    }
    foreach ($favicon as $icon) {
        $type = substr($icon, -3);
        if ($type == 'jpg') {
            $type = 'jpeg';
        }

?>
    <link rel="icon" type="image/<?=$type?>" href="<?=$icon?>">
<?php

    }
}

?>
    <?=isset($head) && $head instanceof render\View ? $head() : ''?>
</head>
<?php flush() ?>
<?=$content?>
</html>

