<?php

namespace monad\admin;

$class = $stripKnownTypes(get_class($model));
$ns = substr($class, 0, strrpos($class, '\\'))

?>
<h2><?=$text("$ns\\inline/$title", __NAMESPACE__."\\inline/$title")?></h2>

