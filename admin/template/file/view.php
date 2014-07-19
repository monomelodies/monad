<?php

namespace monad\admin;
use ErrorException;

header("Content-type: {$media['mimetype']}", true);
if ($media['data']) {
    echo $media['data'];
} else {
    try {
        readfile($media['filename']);
    } catch (ErrorException $e) {
        throw new HTTP404_Exception;
    }
}
die();
    
