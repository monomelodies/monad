<?php

namespace monad;
if ($page['viewprepend']) {
    echo $view($page['viewprepend']);
}

?>
<article class="monad_page <?=$page['slug']?>">
    <h1><?=$page['title']?></h1>
    <?=$page['content']?>
</article>
<?php

if ($page['viewappend']) {
    echo $view($page['viewappend']);
}
unset($page['language'], $page['content']);
return (array)$page;

