<?php $h = MonoLyth::helper('Monad_Decorate_Box');
$link = Link::get("$this::browse", $this->database, $this->model);
$title = Text::get('monad/model/up');
echo $h->using($this->title)
       ->icons('<a href="'.$link.'" title="'.htmlentities(strip_tags($title)).
	           '" class="up">'.$title.'</a>')
       ->head(1, ' id="modeledit"') ?>
<form method="post" action="<?php echo $this->http->self() ?>" id="monad_data">
<?php foreach ($this->models->model->admin() as $group => $fields): ?>
<fieldset>
	<legend><span><?php echo $group ?></span></legend>
<?php	foreach ($fields as $m):
		$data = $o['export']($m);
?>
	<label for="<?php echo str_replace(':', '-', $data['name']) ?>">
		<span><?php echo $o['label']($m) ?>:</span>
		<?php echo $this->publish("slice/monad/fields/".$o['getview']($m), $data) ?>
	</label>
<?php	endforeach; ?>
</fieldset>
<?php endforeach; ?>
<div class="buttonlist">
	<input type="hidden" name="monad_data:____pk____" value="<?php
		echo base64_encode(serialize($o['primary_keys']())) ?>"/>
	<input type="hidden" name="monad_data:____database____" value="<?php
		echo $this->database ?>"/>
	<input type="hidden" name="monad_data:____model____" value="<?php
		echo $this->model ?>"/>
	<button type="submit" name="monad_data:submit">_(monad/model/save)</button>
	<button type="reset" name="monad_data:reset">_(monad/model/reset)</button>
	<button type="submit" class="cancel"
		name="monad_data:cancel">_(monad/model/cancel)</button>
</div>
</form>
<?php echo $h->using(null)->foot() ?>
