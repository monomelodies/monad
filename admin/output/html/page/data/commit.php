<?php $h = MonoLyth::helper('Monad_Decorate_Box', 'Monad_Decorate_SQL',
	'Decorate_Form');
echo $h->using($this->title)->head(1) ?>
<div class="columns">
_(monad/data/commit/explain)
</div>
<?php if ($o): ?>
<form id="monad_restore" action="" method="post"><fieldset>
	<legend><span>_(Commit changes)</span></legend>
	<div class="keep"><span>Keep?</span></div>
	<ol>
<?php	foreach ($o as $i => $q): ?>
		<li>
			<label for="monad_commit-line-<?php echo $i ?>">
			<?php echo $h->using('')->checkbox(
				"monad_commit:line",
				'',
				array(
					'id' => "monad_commit-line-$i",
					'value' => base64_encode(serialize($q))
				)
			);
			try {
				echo $h->using($q['querysql'])->prettyhtml();
			} catch (ErrorException $e) {
				if ($q['deleted']):
					echo $h->using("DELETE FROM {$q['tablename']} WHERE id = '{$q['id']}'")
					       ->prettyhtml();
				else:
					echo $h->using("INSERT INTO {$q['tablename']} VALUES ('{$q['id']}', ...)")
					       ->prettyhtml();
				endif;
			} ?>
			</label>
		</li>
<?php   endforeach ?>
	</ol>
</fieldset>
<div class="buttonlist"><button type="submit" name="monad_restore:save"
	class="save">_(Save changes)</button></div>
</form>
<?php else:
	readfile('info/text/monad/long/commit.noqueue.'.
		$this->language->current->code.'.text', true);
endif;
echo $h->using('')->foot() ?>
