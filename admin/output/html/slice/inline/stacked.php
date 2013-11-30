<?php

namespace monad\admin;
use monolyth\render\form\Hidden;
use monolyth\render\form\Info;

$classes = ['monad_inline', 'list', 'stacked'];
$class = get_class($model);
$check = is_array($items) ? $items[0] : $items;
if ($check instanceof Sortable) {
    $classes[] = 'monad_sortable';
}
$params = '?redir='.urlencode($http->getSelf())
    .'&amp;'.$model->inlineLinks($check);
$form = $self->container->satisfy(new $formClass);
$form->prepare();
$iname = strtolower(preg_replace('@.*\\\\(.*?)_Form@', '\\1', $formClass));
$namespace = substr($formClass, 0, strrpos($formClass, '\\'));

?>
<section>
    <?=$view(__NAMESPACE__.'\slice/inline/title')?>
    <table class="<?=implode(' ', $classes)?>">
        <thead>
            <tr>
                <th colspan="<?=$check instanceof Sortable ? 4 : 3?>" class="actions"><?=$text('actions')?></th>
<?php foreach ($check as $field => $dummy) { ?>
                <th><?=$text([$generate($check, "./$field"), "$namespace\\column/$field", __NAMESPACE__."\\column/$field"])?></th>
<?php } ?>
            </tr>
        </thead>
        <tbody>
<?php if (is_array($items)) foreach ($items as $item) { ?>
            <tr>
<?php   if ($item instanceof Sortable) { ?>
                <td class="action"><a href="#" class="icon sort" title="<?=htmlentities($text('sort'))?>"><?=$text('sort')?></a></td>
<?php   } ?>
                <td class="action"><a href="#" class="icon update" title="<?=htmlentities($text('update'))?>"><?=$text('update')?></a></td>
                <td class="action"><a href="#" class="icon copy" title="<?=htmlentities($text('copy'))?>"><?=$text('copy')?></a></td>
                <td class="action"><a href="#" class="icon delete" title="<?=htmlentities($text('delete'))?>"><?=$text('delete')?></a></td>
<?php   foreach ($item as $field => $value) { ?>
                <td<?=is_numeric($value) ? ' class="numeric"' : ''?>>
<?php

        if (isset($form[$field]) && !($form[$field] instanceof Hidden || $form[$field] instanceof Info)) {
            $form[$field]->prepare("inline[$iname][id_{$item['id']}][$field]");
            $form[$field]->value = $value;

?>
                    <?=$form[$field]?>
                    <span><?=$value?></span>
<?php       } else { ?>
                    <?=$value?>
<?php       } ?>
                </td>
<?php   } ?>
            </tr>
<?php } ?>
            <tr class="createrow">
                <td class="action" colspan="<?=$check instanceof Sortable ? 4 : 3?>">&nbsp;</td>
<?php foreach ($check as $field => $value) { ?>
                <td<?=is_numeric($value) ? ' class="numeric"' : ''?>>
<?php

        if (isset($form[$field]) && !($form[$field] instanceof Hidden || $form[$field] instanceof Info)) {
            $form[$field]->prepare("inline[$iname][0][$field]");
            $form[$field]->value = null;

?>
                    <?=$form[$field]?>
                    <span></span>
<?php       } ?>
                </td>
<?php   } ?>
            </tr>
        </tbody>
    </table>
</section>

