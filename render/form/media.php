<?php namespace monad\render\form ?>
<iframe id="<?=$o->getOption('id')?>" class="monad_file <?=$o->getOption('class')?>" data-id="<?=$o->value?>" src="<?=$url(
    'monad/admin/frame_file',
    ['id' => $o->value]
)?>?element=<?=urlencode($o->getOption('name')).($o->isDisabled() ? '&amp;disabled' : '')?>">
    <img src="<?=$url('monad/admin/view_file', ['id' => $o->value])?>" alt="<?=$o->value?>">
</iframe>
<input type="hidden" name="<?=$o->getOption('name')?>" value="<?=htmlentities($o->value)?>">

