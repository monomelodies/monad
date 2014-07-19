<?php

namespace monad\core;
use monad\view;

$h = new Box_Helper();

echo $h->using($o['title'])->head();

$this->publish(new view\PHP(__NAMESPACE__.'\form/table'), $o['model']);

echo $h->using('')->foot();

