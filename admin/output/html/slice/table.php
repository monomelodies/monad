<?php namespace monad\admin ?>
<table class="monad list">
    <thead><tr>
<?php if (count($actions)) { ?>
        <th class="actions"><?=$text('monad\admin\actions')?></th>
<?php

}
foreach ($items[0] as $name => $value) {
    $name = trim(array_pop(explode('.', array_pop(explode(
        ' as ',
        strtolower($name)
    )))));
    if (is_object($self->model)) {
        $class = get_class($self->model);
        $namespace = substr($class, 0, strrpos($class, '\\'));
        $txt = $text([$generate($self->model, "./$name"), "$namespace\\column/$name", __NAMESPACE__."\\column/$name"]);
    } else {
        $txt = $text([strtolower($self->model)."/$name", "monad\\admin\\column/$name"]);
    }

?>
        <th><a href="<?=array_shift(explode('?', $http->getSelf()))?>?<?=http_build_query([
            's' => $name,
            'd' => isset($_GET['d']) && $_GET['d'] == 'ASC' ? 'DESC' : 'ASC',
        ], '', '&amp;')?>"><?=$txt?></a></th>
<?php } ?>
    </tr></thead>
    <tbody>
<?php

    foreach ($items as $p) {
        if (!isset($numerics)) {
            $numerics = [];
        }
        foreach ($p as $field => $value) {
            if (!isset($numerics[$field])) {
                $numerics[$field] = 0;
            }
            if (is_numeric($value)) {
                $numerics[$field]++;
            }
        }
    }
    $total = count($items);
    foreach ($items as $i => $p) {
        $pks = [];
        foreach ($self->model->keys() as $key) {
            $pks[$key] = $p[$key];
        }
        $id = base64_encode(serialize($pks));

?>
        <tr>
            <td class="action"><table><tbody><tr>
                <td><a class="icon options" title="<?=$text('monad\admin\actions\options')?>" href="#"><?=$text('monad\admin\actions\options')?></a></td>
<?php

        foreach ($actions as $key => $uri) {
            if (!$key) {
                continue;
            }
            $t = $text([$key, "monad\\admin\\$key"]);
            if (!in_array($key, ['copy', 'delete'])) {

?>
                <td><a class="icon <?=strtolower($key)?>" title="<?=$t?>" href="<?=sprintf($uri, $id)?>"><?=$t?></a></td>
<?php           } else { ?>
                <td><form method="post" action="<?=sprintf($uri, $id)?>"><fieldset>
                    <button class="icon <?=strtolower($key)?>" title="<?=$t?>">
                </fieldset></form></td>
<?php

            }
        }

?>
            </tr></tbody></table></td>
<?php

        foreach ($p as $name => $value) {
            $name = trim(array_pop(explode('.', array_pop(explode(
                ' as ',
                strtolower($name)
            )))));
            if ($self->finder->stripTags) {
                $value = strip_tags(preg_replace("@<br/?\s*>@", ' ', $value), '<img>');
            }
            if (preg_match(
                "@\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.*?@",
                $value
            )) {
                // In lists, only show the date part of a date field.
                $value = array_shift(explode(' ', $value));
            }

?>
            <td class="data<?=$numerics[$name] == $total ? ' numeric' : ''?>"><?=$value?></td>
<?php       } ?>
        </tr>
<?php   } ?>
    </tbody>
</table>

