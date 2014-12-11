<?php

namespace monad\admin;
$fid = $form->getId();
$class = get_class($items[0]);
$ns = substr($class, 0, strrpos($class, '\\'));

?>
<fieldset>
    <legend><?=$text(["$ns\\column/$title", "./column/$title"])?></legend>
<?php foreach ($items as $i) { ?>
    <label for="<?=$fid?>-<?=$title?>-<?=$i['id']?>">
        <input type="checkbox" name="<?=$title?>[<?=$i['id']?>]" id="<?=$fid?>-<?=$title?>-<?=$i['id']?>" value="<?=$i['id']?>"<?=$i['_checked'] ?
                ' checked' :
                '' ?>>
        <?=$i?>
    </label><br>
<?php } ?>
</fieldset>

