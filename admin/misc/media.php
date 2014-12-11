<?php

header("Content-type: $mimetype}");
$helper->output($helper->box($media, isset($size) ? $size : null), $mimetype);
die();

