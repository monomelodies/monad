<?php

class Monad_Data_CommitChangesHandler extends Handler
{
	public function handle($form)
	{
		$lines = is_array($form['line']) ? $form['line'] : array($form['line']);
		$done = 0;
		foreach ($lines as $line) {
			if (!isset($line)) {
				continue;
			}
			$data = unserialize(base64_decode($line));
			$id = $data['dbid'];
			unset($data['dbid']);
			$db = DB::i($id);
			try {
				$result = $db->execute($data['querysql'], false);
			} catch (ErrorException $e) {
				$result = $db->execute($db->delete_query(
					'tmp_query_id',
					array(
						'owner' => Monad_User::id(),
						'tablename' => $data['tablename'],
						'id' => $data['id'],
					)
				), false);
			}
			if ($db->affected_rows($result)) {
				$done++;
			} else {
				$this->controller->add_message(new Message(
					Message::WARNING,
					Text::get('monad/message/data/commit/warning.conflict')
				));
			}
		}
		if (!$done) {
			$this->controller->add_message(new Message(
				Message::WARNING,
				Text::get('monad/message/data/commit/warning/nothing_committed')
			));
		} else {
			$this->controller->add_message(new Message(
				Message::SUCCESS,
				Text::get(
					'monad/message/data/commit/success'.($done == 1 ? '.1' : ''),
					$done
				)
			));
		}
		$config = MonoLyth::get('DBConfig');
		foreach ($config as $id => $db) {
			if (!is_a($db, 'MonoLyth_DB') || $id == 'current') {
				continue;
			}
			try {
				$db->delete(
					'tmp_query',
					array(
						'owner' => Monad_User::id(),
						'session' => substr(session_id(), 0, 32),
					)
				);
			} catch (Exception_DB_Delete_None $e) {
				/** That's okay. */
			}
			try {
				$q = $db->getrows(
					'tmp_query_id',
					'DISTINCT tablename',
					array('owner' => Monad_User::id())
				);
				foreach ($q as $row) {
					try {
						$db->delete(
							$row['tablename'],
							array('id IN ('.$db->select(
								'tmp_query_id',
								'id',
								array('owner' => Monad_User::id(), 'tablename' => $row['tablename'])
							).')')
						);
					} catch (Exception_DB_Delete_None $e) {
						/**
						 * This row doesn't exist (anymore).
						 * We won't add a message, since there's nothing we can do about it
						 * anymore anyway.
						 */
					} catch (Exception_DB_SQL_Error $e) {
						/** Something else went wrong, most likely a missing id column. */
					}
					
					/** Cleanup. */
					try {
						$db->delete(
							'tmp_query_id',
							array('tablename' => $row['tablename'], 'owner' => Monad_User::id())
						);
					} catch (Exception_DB_Delete_None $e) {
						/** Weird, but whatever. */
					}
				}
			} catch (Exception_DB_SQL_NoResults $e) {}
		}
		return true;
	}
}

?>
