<?php namespace monad\admin ?>
<nav id="main"><ul class="menu">
<?php

foreach ($menu->items() as $package => $group) {
    $classes = explode(' ', $package);
    foreach ($classes as &$class) {
        $class = "menu-$class";
    }

?>
    <li class="<?=implode(' ', $classes)?>">
        <h2><?=$group->title()?></h2>
        <ul class="submenu">
<?php

    foreach ($group->items() as $uri => $txt) {
        $parts = explode('/', $uri);
        $class = '';
        while (!strlen($class) && $parts) {
            $class = array_pop($parts);
        }

?>
            <li class="menu-<?=$class?>"><a href="<?=$uri?>"><?=$txt?></a></li>
            
<?php   } ?>
        </ul>
    </li>
<?php } ?>
</ul></nav>

