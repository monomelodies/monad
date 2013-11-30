<?php

namespace monad;
use monolyth\Link;
$h = new helper\decorate\Box();

?>
<div class="generic-2col">
    <div class="objectlist">
<?php

$this->publish(new view\PHP('monad\slice/generic/list/database'),
    '\monad\controller\Data::browse');
$this->publish(new view\PHP('monad\slice/generic/list/model'),
    '\monad\controller\Data_Model::browse');

?>
    </div>
<?php

list($ns, $name) = $this->models->model->getModelURL();
$link = Link::get(
    '\monad\controller\Data_Model::browse',
    $this->database,
    $ns,
    $name
);
$title = $this->text('monad\model/up');
echo $h->using($this->title)
       ->icons('<a href="'.$link.'" title="'.htmlentities(strip_tags($title)).
               '" class="up">'.$title.'</a>')
       ->head(1, ' id="modeledit"');
$edit = $o['getEdit']();

?>
<form method="post" action="<?php echo $this->http->getSelf()
    ?>" id="monad_data">
<?php foreach ($edit[$o::FIELDS] as $group => $fields): ?>
<?php   if (isset($fields[$o::CLASSES])): ?>
<fieldset class="<?php echo $fields[$o::CLASSES] ?>">
<?php

        unset($fields[$o::CLASSES]);
    else: ?>
<fieldset>
<?php

    endif;
    if (!is_numeric($group)):

?>
    <legend><span><?php echo $group ?></span></legend>
<?php
    endif;

    foreach ($fields as $m):
        $data = $o['export']($m);

?>
    <label for="<?php echo str_replace(':', '-', $data['name']) ?>">
        <span><?php echo $o['getLabel']($m) ?>:</span>
        <?php echo $this->publish(new view\PHP('slice/fields/'.$o['getView']($m)), $data) ?>
    </label>
<?php   endforeach; ?>
</fieldset>
<?php endforeach; ?>
<div class="buttonlist">
    <input type="hidden" name="monad_data:____pk____" value="<?php
        echo base64_encode(serialize($o['getPrimaryKeys']())) ?>"/>
    <input type="hidden" name="monad_data:____database____" value="<?php
        echo $this->database ?>"/>
    <input type="hidden" name="monad_data:____model____" value="<?php
        echo $this->model ?>"/>
    <button type="submit" name="monad_data:submit">_(monad\model/save)</button>
    <button type="reset" name="monad_data:reset">_(monad\model/reset)</button>
    <button type="submit" class="cancel"
        name="monad_data:cancel">_(monad\model/cancel)</button>
</div>
</form>
<?php echo $h->using(null)->foot() ?>
</div>
