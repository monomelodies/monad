<?php

namespace monad\core;

$fields = $o['getCurrent']();
$first = array_shift($fields[$o::FIELDS]);

?>
<tr>
    <th><label for="<?=$o['getId']($first['field'])?>"><?=$o['defaultLabel']($first['field'])?></label></th>
    <td><?php
    
$view = $this->view(__NAMESPACE__.'\slice/fields/'.$o['getView']($first['field']));
$view->data($first);
echo $view;
foreach ($fields[$o::FIELDS] as $field) {

?>
        <label for="<?=$o['getId']($field['field'])?>"><?=$o['defaultLabel']($field['field'])?></label>
<?php

    $view = $o['getView']($field['field']);
    $view = $this->view(__NAMESPACE__.'\slice/fields/'.$view));
    $view->data($field);
    echo $view;
}

?>
    </td>
</tr>

