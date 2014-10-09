<?php

namespace monolyth;
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
<!--[if lt IE 7]><html class="no-js lt-ie10 lt-ie9 lt-ie8 lt-ie7" lang="<?=$language->current->code?>"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie10 lt-ie9 lt-ie8" lang="<?=$language->current->code?>"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie10 lt-ie9" lang="<?=$language->current->code?>"><![endif]-->
<!--[if IE 9]><html class="no-js lt-ie10" lang="<?=$language->current->code?>"><![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="<?=$language->current->code?>"><!--<![endif]-->
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
    <link rel="stylesheet" href="/css/monad/monad.css">
    <link rel="stylesheet" href="/css/monad/<?=$project['theme']?>/<?=$project['theme']?>.css">
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

