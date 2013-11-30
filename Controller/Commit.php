<?php

require_once 'controller/monad/controller.php';
class Monad_CommitController extends Monad_Controller
{
	public function __construct()
	{
		parent::__construct();
	}

	public function _commit()
	{
		$this->title = Text::get('Commit changes');
		require_once 'form/monad/commit.php';
		$data = $this->http->post('monad_commit');
		$this->forms->commit = new Monad_CommitForm($data ? $data : array());
		if (
			$this->http->is_valid_post() and
			$this->handle('Monad_Data_CommitChanges', $this->forms->commit)
		) {
			$this->redirect($this->http->self());
		}
		$all = array();
		$config = MonoLyth::get('DBConfig');
		foreach ($config as $id => $db) {
			if ($id == 'current' || !is_a($db, 'MonoLyth_DB_GenericSQL')) {
				continue;
			}
			try {
				$old = $db->getrows(
					'tmp_query',
					array('*', "'$id' AS dbid"),
					array(
						'owner' => Monad_User::id(),
						'session' => substr(SESSION::id(), 0, 32),
					),
					array('order' => array(array('asc' => 'datecreated')))
				);
				foreach ($old as $row) {
					$all[] = $row->getArrayCopy();
				}
			} catch (Exception_DB_SQL_NoResults $e) {
				/** Nothing to commit. */
			}
			try {
				$new = $db->getrows(
					'tmp_query_id',
					array('*', "'$id' AS dbid"),
					array('owner' => Monad_User::id()),
					array('order' => array(array('asc' => 'tablename'), array('asc' => 'id')))
				);
				foreach ($new as $row) {
					$all[] = $row->getArrayCopy();
				}
			} catch (Exception_DB_SQL_NoResults $e) {
				/** Nothing to insert. */
			}
		}
		$this->publish(
			array('page/monad/data/commit', 'template/monad/page'),
			$all
		);
	}
}

?>
