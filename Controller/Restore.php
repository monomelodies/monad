<?php

require_once 'controller/monad/controller.php';
class Monad_RestoreController extends Monad_Controller
{
	public function __construct()
	{
		parent::__construct();
	}

	public function _session()
	{
		Text::load('Monad/restore');
		$this->title = Text::get('Restore session');
		$this->menutop = array(
			Text::get('Session') => array(
				'session-restore' => array(
					Link::get('Monad_Commit::restore_session'),
					Text::get('Restore session'),
				),
			),
		);
		$this->sessions = array();
		$data = $this->http->post('monad_restore');
		require_once 'form/monad/restore.php';
		$this->forms->restore = new Monad_RestoreForm($data ? $data : array());
		if ($this->http->is_valid_post()) {
			$this->handle('Monad_Session_Restore', $this->forms->restore);
		}
		$config = MonoLyth::get('DBConfig');

		foreach ($config as $id => $db) {
			if ($id == 'current') {
				continue;
			}
			try {
				$old = $db->getrows(
					'tmp_query',
					'*',
					array(
						'userid' => Monad_User::id(),
						'sessionid' => array('<>' => substr(SESSION::id(), 0, 32)),
					),
					array('order' => array(array('desc' => 'datecreated')))
				);
				$all = array();
				foreach ($old as $row) {
					$all[$row['querysql']] = $row;
				}
				$this->sessions[$id] = array_values($all);
			} catch (Exception_DB_SQL_NoResults $e) {}
		}
		if (!$this->sessions) {
			$this->redirect(Link::get('Monad_Project::overview'));
		}
		$this->publish(array(
			'page/monad/restore.session',
			'template/monad/page',
		));
	}
}

?>
