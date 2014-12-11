<?php

namespace monad\core;
use monad\view;

$fieldsets = $o['getFieldsets']();
foreach ($fieldsets as $legend => $fieldset):

?>
<fieldset>
<?php   if (!is_int($legend)): ?>
    <legend><?php echo $legend ?></legend>
<?php   endif ?>
    <table class="monad">
<?php

    if (!isset($fieldset[0])):
        $fieldset = array($fieldset);
    endif;
    foreach ($fieldset as $group):
        foreach ($group[$o::FIELDS] as &$field):
            $field = $o['export']($field);
        endforeach;
        echo $this->view(__NAMESPACE__.'\form/'.$group[$o::TYPE])
                 ->attach($o['using']($group));
    endforeach;

?>
    </table>
</fieldset>
<?php

endforeach;

