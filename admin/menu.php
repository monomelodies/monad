<?php namespace monad\admin ?>
<nav id="main"><ul class="menu">
<?php

foreach ($menu->items() as $package => $group) {
    if (!$group->hasPermission()) {
        continue;
    }
    $classes = explode(' ', $package);
    foreach ($classes as &$class) {
        $class = "menu-$class";
    }

?>
    <li class="<?=implode(' ', $classes)?>">
        <h2><?=$group->title()?></h2>
        <ul class="submenu">
<?php

    foreach ($group->items() as $item) {
        if (!$item->hasPermission() || $item->hidden) {
            continue;
        }
        $uri = $item->url();
        $parts = explode('/', $uri);
        $class = '';
        while (!strlen($class) && $parts) {
            $class = array_pop($parts);
        }

?>
            <li class="menu-<?=$class?>"><a href="<?=$uri?>"><?=$item?></a></li>
            
<?php   } ?>
        </ul>
    </li>
<?php } ?>
</ul></nav>

