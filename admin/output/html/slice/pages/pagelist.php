<?php $h = MonoLyth::helper('Monad_Decorate_Box') ?>
<div id="pagelist" class="objectlist wide">
	<?php echo $h->using(Text::get('Pages in <code>%s</code>',
		$this->config->database))->head(2) ?>
<?php if (count($o)): ?>
	<ul>
<?php	foreach ($o as $m => $props):
		$class = '';
		if ($props['compound']):
			$class = ' class="compound"';
		elseif (!class_exists("{$m}Model", false)):
			$class = ' class="table"';
		endif ?>
		<li<?php echo $class ?>><a title="<?php echo Text::get(
			'Edit page %s', $m) ?>" href="<?php echo Link::get(
			'Monad_Pages::edit', $this->config->database, $m)
			?>"><?php echo $m ?></a></li>
<?php	endforeach ?>
	</ul>
<?php endif ?>
	<hr/>
	<?php echo $h->using(null)->foot() ?>
</div>
