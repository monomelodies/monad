<?php $h = MonoLyth::helper('Monad_Decorate_Box');
echo $h->using('_(Databases in this project)')
       ->head(2, '', ' databaselist shallow') ?>
<?php if ($o): ?>
<ul>
<?php	 foreach ($o as $name => $dummy): ?>
	<li class="database"><a title="<?php echo Text::get(
		'Select database %s', $name) ?>" href="<?php echo Link::get(
		'Monad_Pages::browsedb', $name) ?>"><?php echo $name ?></a></li>
<?php	 endforeach; ?>
</ul>
<hr/>
<?php else: ?>
<p>
	_(No editable databases found in your project.)
</p>
<?php endif; echo $h->using(null)->foot() ?>
