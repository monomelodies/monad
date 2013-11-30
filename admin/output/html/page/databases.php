<?php

namespace monad\admin;
$title = $text('./title');
echo $boxHead($title);

?>
<nav class="databases"><ul>
<?php foreach ($databases as $db) { ?>
    <li><a href="<?=$db?>/"><?=$db?></a></li>
<?php } ?>
</ul></nav>
<?php

echo $boxFoot('');
return compact('title');

