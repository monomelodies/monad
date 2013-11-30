<?php

namespace monad;
$previous = $paginator->previous();
$next = $paginator->next();
$first = $paginator->first();
$last = $paginator->last();
$current = $paginator->current();
$page = function($page) {
    return '?'.http_build_query(compact('page') + $_GET);
};

?>
<ul class="paginate">
<?php if ($first < max($current - 9, 1)) { ?>
    <li class="first"><a href="<?=$page($first)?>"><?=$first?></a></li>
<?php

}
if ($previous) {

?>
    <li><a href="<?=$page($previous)?>">&laquo;</a></li>
<?php

}
for ($i = max($current - 9, 1); $i < $current; $i++) {

?>
    <li><a href="<?=$page($i)?>"><?=$i?></a></li>
<?php } ?>
    <li><strong><?=$current?></strong></li>
<?php for (
    $i = $current + 1;
    $i <= min($current + 9, $last);
    $i++
) { ?>
    <li><a href="<?=$page($i)?>"><?=$i?></a></li>
<?php

}
if ($next) {

?>
    <li><a href="<?=$page($next)?>">&raquo;</a></li>
<?php

}
if ($last > min($current + 9, $last)) {

?>
    <li class="last"><a href="<?=$page($last)?>"><?=$last?></a></li>
<?php } ?>
</ul>

