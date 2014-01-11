<?php

namespace monad\admin;
use monolyth\Finder;
use Adapter_Access;
use monolyth\adapter\sql\NoResults_Exception;
use monolyth\Media_Model;

class Media_Finder implements Finder
{
    use Adapter_Access;

    public function all($folder = null)
    {
        try {
            $rows = self::adapter()->rows(
                'monolyth_media',
                '*',
                compact('folder')
            );
            uasort($rows, function($a, $b) {
                if ($a['originalname'] == $b['originalname']) {
                    return $a['id'] < $b['id'] ? -1 : 1;
                }
                return $a['originalname'] < $b['originalname'] ? -1 : 1;
            });
            return $rows;
        } catch (NoResults_Exception $e) {
            return null;
        }
    }

    public function find($id)
    {
        try {
            return (new Media_Model)->load(self::adapter()->row(
                'monolyth_media',
                '*',
                compact('id')
            ));
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

