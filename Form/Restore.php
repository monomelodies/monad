<?php

/** @see Form */
require_once 'form/form.php';

class Monad_RestoreForm extends Form
{
	public function __construct(array $data)
	{
		$this->define('line');
		parent::__construct($data);
	}
}

?>
