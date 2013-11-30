<table>
<?php foreach ($o as $i => $row): ?>
<tr>
	<td><?=$h->using($o['selected']($row))->checkbox(
		$o['monadfieldname']('id'),
		$row->_('title'),
		array(
			'value' => $row->_('id'),
			'id' => str_replace(':', '-', $o['monadfieldname']('id')).$i,
		)
	)?></td>
</tr>
<?php endforeach; ?>
</table>
