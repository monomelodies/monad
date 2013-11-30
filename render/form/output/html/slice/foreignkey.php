<?php

namespace monad\render\form;

if (!isset($o->initial)) {
    echo $text('none');
} else {

?>
<select <?=$o->renderOptions()?>>
<?php   if ($o->nullAllowed()) { ?>
    <option value=""></option>
<?php

    }
    foreach ($o->initial as $row) {
        if (count($row) == 3) {
            list($id, $value, $filter) = array_values($row);
        } else {
            list($id, $value) = array_values($row);
        }

?>
    <option<?=isset($filter) ? ' data-filter="'.$filter.'"' : ''?> value="<?=$id?>"<?=$id == $o->value ? ' selected' : '' ?>><?=$value?> (<?=$id?>)</option>
<?php   } ?>
</select>
<?php } ?>

