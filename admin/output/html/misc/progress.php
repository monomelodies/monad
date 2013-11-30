<?php

session_id(md5(microtime().rand(0, 999)));
session_start();
$var = ini_get('session.upload_progress.prefix');
$var .= 'monad_media';
if (isset($_SESSION[$var])) {
    $var = $_SESSION[$var];
    $var = $var['bytes_processed'] / $var['content_length'];
    $progress = round($var * 100);
    $data = ['value' => $progress];
} else {
    // For very fast uploads, it may be that it already finished before
    // we reach this point, in which case there won't be any upload to
    // check :)
    $data = ['value' => 100];
}
echo json_encode($data);

