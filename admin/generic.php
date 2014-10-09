<?php

namespace monad;
if ($page['viewprepend']):
    echo $self->view($page['viewprepend'], compact('page'));
endif;

?>
<article class="monad_page <?php echo $page['slug'] ?>">
    <h1><a href="<?php echo model\Page::url($page) ?>"><?php echo $page['title']
        ?></a></h1>
    <?php echo $page['content'] ?>
    <footer><?php echo $self->text(
        './pubdate',
        date('r', strtotime($page['datecreated']))
    ) ?></footer>
</article>
<?php

if ($page['viewappend']):
    echo $self->view($page['viewappend'], compact('page'));
endif;
return array('title' => $page['title']);

