<?php

namespace monad;
if ($this->databases):

?>
<div class="objectselector">
<?php

	$this->publish(
		new view\PHP('monad\slice/generic/list/database'),
		'\monad\controller\Data_Base::browse'
	);
	$this->publish(
		new view\PHP('monad\slice/generic/list/model'),
		'\monad\controller\Data_Model::browse'
	);

?>
</div>
<?php endif ?>
