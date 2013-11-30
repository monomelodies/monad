<?php

namespace monad\admin;
use ErrorException;

header("Content-type: $mimetype}");
$count = count($medias);
list($width, $height) = explode('x', $size);
$fn = 'image'.substr($mimetype, strrpos($mimetype, '/') + 1);
$out = imagecreatetruecolor($width, $height * $count);
$white = imagecolorallocate($out, 255, 255, 255);
imagefill($out, 0, 0, $white);
foreach (array_values($medias) as $i => $media) {
    try {
        $tmp = $helper->box($media, $size);
        $posx = round(($width - imagesx($tmp)) / 2);
        $posy = round(($height - imagesy($tmp)) / 2);
        imagecopy($out, $tmp, $posx, $i * $height + $posy, 0, 0, $width, $height);
    } catch (ErrorException $e) {
    }
}
$fn($out);
die();

