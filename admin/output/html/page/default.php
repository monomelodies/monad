<?php

namespace monad;
$title = $text('default/title');
echo $boxHead($title, ' id="intro"');
$m = $_SESSION['Modules'][$name];

?>
<p><?=$text('default/intro')?></p>
<h2><?=$text('default/header')?></h2>
<dl>
    <dt><?=$text('default/version')?></dt>
    <dd><?=$m['info']['version']?></dd>
    <dt><?=$text('default/author')?></dt>
    <dd><a href="<?=$m['info']['url']?>"><?=$m['info']['name']?></a></dd>
    <dt><?=$text('default/copyright')?></dt>
    <dd>&copy; <?=$m['info']['copyright']?></dd>
    <dt><?=$text('default/license')?></dt>
    <dd><?=$m['info']['license']?></dd>
</dl>
<h2><?=$text('default/header.credits')?>:</h2>
<ul><?=$text('default/credits.list')?></ul>
<?php

echo $boxFoot();
return compact('title');

