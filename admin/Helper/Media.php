<?php

namespace monad\admin;

class Media_Helper
{
    public function __construct($project)
    {
        $this->project = $project;
    }

    public function box($media, $size = null)
    {
        if (!isset($size)) {
            $i = getimagesize($media['filename']);
            $w = $i[0];
            $h = $i[1];
        } else {
            list($w, $h) = explode('x', $size);
        }
        $fn = 'imagecreatefrom'.array_pop(explode('/', $media['mimetype']));
        $orig = $fn($media['filename']);
        $i = [imagesx($orig), imagesy($orig)];
        // Fit into a box of $width x $height pixels
        $mod = $i[0] / $i[1];
        if ($w / $h > $mod) {
            $nh = $w / $mod;
            $nw = $w;
        } else {
            $nw = $h * $mod;
            $nh = $h;
        }
        $mids = [round($nw / 2), round($nh / 2)];
        $tmp = imagecreatetruecolor(round($nw), round($nh));
        $white = imagecolorallocate($tmp, 255, 255, 255);
        imagefill($tmp, 0, 0, $white);
        imagecopyresampled($tmp, $orig, 0, 0, 0, 0, $nw, $nh, $i[0], $i[1]);
        $new = imagecreatetruecolor($w, $h);
        $white = imagecolorallocate($new, 255, 255, 255);
        imagefill($new, 0, 0, $white);
        imagecopyresampled(
            $new, $tmp, 0, 0,
            isset($_GET['ox']) ? $_GET['ox'] : ($mids[0] - $w / 2),
            isset($_GET['oy']) ? $_GET['oy'] : ($mids[1] - $h / 2),
            $w, $h, $w, $h
        );
        imagedestroy($tmp);
        imagedestroy($orig);
        return $new;
    }

    public function output($media, $mime)
    {
        $out = 'image'.array_pop(explode('/', $mime));
        return $out($media);
    }
}

