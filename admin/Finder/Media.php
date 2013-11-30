<?php

namespace monad\admin;
use monolyth\Finder;
use monolyth\adapter;
use monolyth\adapter\sql\NoResults_Exception;

class Media_Finder implements Finder, adapter\Access
{
    public function all($folder = null)
    {
        try {
            $rows = $this->adapter->rows(
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
            return $this->model->load($this->adapter->row(
                'monolyth_media',
                '*',
                compact('id')
            ));
        } catch (NoResults_Exception $e) {
            return null;
        }
    }
}

