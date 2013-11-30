<?php

namespace monad;
$title = $text('./title');
echo $box($title)->head('id="page404"');
echo $text(['./content', 'monad\admin\404/title']);
echo $box('')->foot();
return compact('title');

