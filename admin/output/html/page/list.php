<?php

namespace monad\admin;

$title = $text('monad\admin\list/title');
unset($actions['list']);
if (isset($actions['create'])) {
    $txt = $text('monad\admin\create', $target, $database);
    echo $boxHead($boxIcons($title, '<a class="create" title="'.htmlentities($txt).'" href="'.$actions['create'].'">'.$txt.'</a>'), null, ' monad');
    unset($actions['create']);
} else {
    echo $boxHead($title, null, ' monad');
}
if ($filters = $finder->filters()) {

?>
<form method="get" action="">
    <fieldset>
        <legend><?=$text('monad\admin\filters')?></legend>
        <input type="hidden" name="filter">
<?php

    foreach (array_values($filters) as $idx => $filter) {
        if (isset($filter['html'])) {
            if ($filter['title']) {
                echo '<label for="f_'.$idx.'">'.$filter['title'].'</label> ';
            }
            echo $filter['html'].' ';
        } else {
            echo '<input type="checkbox" name="f['.$idx.']" id="f_'.$idx.'"'
                .(isset($_GET['f'][$idx]) ? ' checked' : '').' value="1">';
            echo ' <label for="f_'.$idx.'">'.$filter['title'].'</label> ';
        }
    }

?>
        <button type="submit"><?=$text('monad\admin\filter')?></button>
    </fieldset>
</form>
<?php } ?>
<?php if ($finder instanceof Searchable) { ?>
<form method="get" action="">
    <fieldset>
        <legend><?=$text('monad\admin\search')?></legend>
        <input type="search" name="q">
        <button type="submit"><?=$text('monad\admin\search/do')?></button>
    </fieldset>
</form>
<?php

}
if ($items && count($items)) {
    echo $view($finder->view, compact('items', 'actions'));
} else {
    echo $text(['./none', 'monad\admin\list/none']);
}
if ($paginator && $paginator->last() > 1) {
    echo $view('monad\admin\slice/paginate', compact('paginator'));
}
echo $boxFoot();
return compact('title');

