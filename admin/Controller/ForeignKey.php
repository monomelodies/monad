<?php

namespace monad\admin;
use ErrorException;
use monolyth\HTTP400_Exception;
use monolyth\Text_Model;

class ForeignKey_Controller extends Controller implements Login_Required
{
    protected function get(array $args)
    {
        try {
            $database = $_GET['database'];
            $package = $_GET['package'];
            $target = $_GET['target'];
            $field = $_GET['field'];
        } catch (ErrorException $e) {
            throw new HTTP400_Exception;
        }
        $parts = array_reverse(explode('_', $target));
        foreach ($parts as &$part) {
            $part = ucfirst($part);
        }
        $class = sprintf(
            '%s\admin\%s_Finder',
            $package == 'project' ? '' : "\\$package",
            implode('_', $parts)
        );
        $finder = $class::instance();
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $items = $finder->all(10, $page);
        $data = [
            'pages' => $items->getPageSize(),
            'items' => [],
            'headers' => [],
        ];
        foreach ($items as $item) {
            $data['items'][] = (array)$item;
            if (!$data['headers']) {
                $headers = [];
                $text = new Text_Model($finder);
                foreach ($item as $key => $value) {
                    $headers[$key] = [
                        [
                            "./$key",
                            "$package\\admin\\column/$key",
                            "monad\\admin\\column/$key",
                        ],
                        self::language()->current->code,
                    ];
                }
                $text->load($headers);
                foreach ($headers as $i => $match) {
                    $headers[$i] = $text->retrieve($match[0], $match[1]);
                }
                $data['headers'] = $headers;
            }
        }
        $this->template = false;
        return $this->view('monolyth\render\page/json', compact('data'));
    }
}

