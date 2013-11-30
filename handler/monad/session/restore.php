<?php

class Monad_Session_RestoreHandler extends Handler
{
	public function handle(Form $form)
	{
		foreach ($form as $db => $data) {
			if (!($db = DB::i($db))) {
				continue;
			}
			try {
				$data = unserialize(base64_decode($data['line']));
			} catch (ErrorException $e) {
				continue;
			}
			$db->update(
				'tmp_query',
				array('sessionid' => substr(session_id(), 0, 32)),
				array(
					'userid' => Monad_User::id(),
					'sessionid' => $data['sessionid'],
					'querysql' => $data['querysql'],
				)
			);
		}
		foreach (MonoLyth::get('DBConfig') as $id => $db) {
			if (!is_a($db, 'MonoLyth_DB_GenericSQL') || $id == 'current') {
				continue;
			}
			try {
				$db->delete(
					'tmp_query',
					array(
						'sessionid' => array('<>' => substr(session_id(), 0, 32)),
						'userid' => Monad_User::id(),
					)
				);
			} catch (Exception_DB_Delete_None $e) {}
		}
		return true;
	}
}

?>
