<?php namespace monad\render\form ?>
<textarea <?=$o->renderOptions()?>><?=htmlentities($o->parser->__invoke($o->value), ENT_COMPAT, 'UTF-8')?></textarea>

