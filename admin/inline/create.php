<?php

namespace monad\admin;
$classes = ['monad_inline', 'list'];
$class = get_class($model);
if ($items instanceof Sortable) {
    $classes[] = 'monad_sortable';
}
$params = '?redir='.urlencode($http->getSelf()).(method_exists($items, 'inlineLinks') ? '&amp;'.$items->inlineLinks($model) : '');

?>
<section>
    <?=$view(__NAMESPACE__.'\inline/title')?>
<?php if (!($items instanceof Uncreateable_Model)) { ?>
    <table class="<?=implode(' ', $classes)?>">
        <thead>
            <tr>
                <th class="actions"><?=$text('actions')?></th>
                <th class="action"><a href="<?=$scaffold(
                    'create',
                    $database,
                    $items
                ).$params?>" class="icon create" title="<?=htmlentities($text('create'))?>">
                    <?=$text('create')?>
                </a></th>
            </tr>
        </thead>
    </table>
<?php } ?>
</section>

