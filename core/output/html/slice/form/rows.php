<?php

namespace monad\core;
use monad\view;

$fields = $o['getCurrent']();
foreach ($fields[$o::FIELDS] as $field):

?>
<tr>
    <th><label for="<?php echo $o['getId']($field['field']) ?>"><?php
        echo $o['defaultLabel']($field['field']) ?></label></th>
    <td><?php

    $view = $o['getView']($field['field']);
    echo $this->view(__NAMESPACE__."\slice/fields/$view")->attach($field);
    
?></td>
</tr>
<?php endforeach ?>

