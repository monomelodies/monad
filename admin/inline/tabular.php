<?php

namespace monad\admin;

$classes = ['monad_inline', 'list'];
$class = get_class($model);
if ($items[0] instanceof Sortable) {
    $classes[] = 'monad_sortable';
}
$namespace = substr($class, 0, strrpos($class, '\\'));
$params = '?redir='.urlencode($http->getSelf());
$links = function($model, $parent) {
    if (method_exists($model, 'inlineLinks')) {
        return '&amp;'.$model->inlineLinks($parent);
    }
};

?>
<section>
    <?=$view(__NAMESPACE__.'\inline/title')?>
    <table class="<?=implode(' ', $classes)?>">
        <thead>
            <tr>
                <th colspan="<?=$items[0] instanceof Sortable ? 4 : 3?>" class="actions"><?=$text('actions')?></th>
<?php foreach ($items[0] as $field => $dummy) { ?>
                <th><?=$text([$generate($items[0], "./$field"), "$namespace\\column/$field", __NAMESPACE__."\\column/$field"])?></th>
<?php } ?>
<?php if ($items[0] instanceof Uncreateable_Model) { ?>
                <th></th>
<?php } else { ?>
                <th class="action"><a href="<?=$scaffold(
                    'create',
                    $items[0]
                ).$params.$links($items[0], $model)?>" class="icon create" title="<?=htmlentities($text('create'))?>"><?=$text('create')?></a></th>
<?php } ?>
            </tr>
        </thead>
        <tbody>
<?php foreach ($items as $item) { ?>
            <tr>
<?php   if ($item instanceof Sortable) { ?>
                <td class="action"><a href="<?=$scaffold('sort', $item).$params.$links($items[0], $model)
                    ?>" class="icon sort" title="<?=htmlentities($text('sort'))?>"><?=$text('sort')?></a></td>
<?php   } ?>
<?php   if (!($item instanceof Uneditable_Model)) { ?>
                <td class="action"><a href="<?=$scaffold('update', $item).$params.$links($items[0], $model)
                    ?>" class="icon update" title="<?=htmlentities($text('update'))?>"><?=$text('update')?></a></td>
<?php   } else { ?>
                <td class="action"></td>
<?php   } ?>
<?php   if (!($item instanceof Uncopyable_Model)) { ?>
                <td class="action"><a href="<?=$scaffold('copy', $item).$params.$links($items[0], $model)
                    ?>" class="icon copy" title="<?=htmlentities($text('copy'))?>"><?=$text('copy')?></a></td>
<?php   } else { ?>
                <td class="action"></td>
<?php   } ?>
<?php   if (method_exists($item, 'delete')) { ?>
                <td class="action"><a href="<?=$scaffold('delete', $item).$params.$links($items[0], $model)
                    ?>" class="icon delete" title="<?=htmlentities($text('delete'))?>"><?=$text('delete')?></a></td>
<?php   } else { ?>
                <td class="action"></td>
<?php   } ?>
<?php   foreach ($item as $field => $value) { ?>
                <td<?=is_numeric($value) ? ' class="numeric"' : ''?>><?=$value?></td>
<?php   } ?>
            </tr>
<?php } ?>
        </tbody>
    </table>
</section>

