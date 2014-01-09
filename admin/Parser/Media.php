<?php

namespace monad\admin;
use monolyth\core\Parser;
use monolyth\render\Url_Helper;
use adapter\Access as Adapter_Access;
use monolyth\adapter\sql\NoResults_Exception;

class Media_Parser extends Parser
{
    use Project_Access;
    use Adapter_Access;
    use Url_Helper;

    public function __invoke($html)
    {
        if (!preg_match_all(
            "@
                (<|&lt;)img.*?src=(\"|&quot;)
                    {media:(\d+|[0-9a-f]{32}):(jpe?g|png|gif)}
                (\"|&quot;).*?(>|&gt;)
            @mx",
            $html,
            $matches,
            PREG_SET_ORDER
        )) {
            return $html;
        }
        $ids = [];
        foreach ($matches as $match) {
            $ids[] = $match[3];
        }
        try {
            $imgs = [];
            foreach (self::adapter()->rows(
                'monolyth_media',
                '*',
                [['id' => ['IN' => $ids], 'md5' => ['IN' => $ids]]]
            ) as $row) {
                $imgs[$row['id']] = $imgs[$row['md5']] = $row;
            }
        } catch (NoResults_Exception $e) {
            // None found; just strip everything.
            $replace = [];
            foreach ($matches as $match) {
                $replace[] = $match[0];
            }
            return str_replace($replace, '', $html);
        }
        $new = $old = [];
        foreach ($matches as $match) {
            $old[] = $match[0];
            if (!isset($imgs[$match[3]])) {
                $new[] = '';
                continue;
            }
            $ext = $match[4];
            if ($ext == 'jpeg') {
                $ext = 'jpg';
            }
            $new[] = str_replace(
                "src={$match[2]}{media:{$match[3]}:{$match[4]}}{$match[2]}",
                sprintf(
                    'src="%s"',
                    $this->url(
                        'monad/admin/media',
                        ['id' => $match[3], 'type' => $match[4]]
                    )
                ),
                $match[0]
            );
        }
        return str_replace($old, $new, $html);
    }
}

