<?php $h = MonoLyth::helper('Monad_Decorate_SQL', 'Monad_Decorate_Box',
	'Decorate_Form');
echo $h->using('_(Restore session)')->head(1) ?>
<p>
	_(Changes from a previous session were found.)
	_(Please specifiy what action you'd like to take:)
</p>
<form id="monad_restore" action="" method="post">
<?php foreach ($this->sessions as $id => $queries): ?>
	<fieldset>
		<legend><span><?php echo $id ?></span></legend>
		<div class="keep"><span>_(Keep)?</span></div>
		<ol>
<?php	foreach ($queries as $i => $q): ?>
			<li>
				<label for="monad_restore-<?php echo $id ?>-line-<?php echo $i ?>">
				<?php echo $h->using('')->checkbox(
					"monad_restore:$id:line",
					'',
					array(
						'id' => "monad_restore-$id-line-$i",
						'value' => base64_encode(serialize($q->getArrayCopy())),
					)
				) ?>
					<?php echo $h->using($q['querysql'])->prettyhtml() ?>
				</label>
			</li>
<?php	endforeach ?>
		</ol>
	</fieldset>
	<div class="buttonlist"><button type="submit" name="monad_restore:save"
		class="save">_(Save changes)</button></div>
<?php endforeach ?>
</form>
<?php echo $h->using('')->foot() ?>
