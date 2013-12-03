<?php

namespace monad\core;

?>
    <div class="languages"><nav><ul>
<?php   foreach ($o['available'] as $l): ?>
        <li title="<?php echo $this->text('language/switch',
            $l->title) ?>" class="language <?php echo $l->code
            ?>"><a href="#<?php echo $l->code ?>"><?php echo $l->title
            ?></a></li>
<?php   endforeach ?>
    </ul></nav></div>
    <hr class="clear both"/>

