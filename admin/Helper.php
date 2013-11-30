<?php

namespace monad\admin;
use monolyth\utils\Name_Helper;
use monolyth\render\Url_Helper;

trait Helper
{
    use Name_Helper, Url_Helper;

    public function scaffold($action, $database, Model $object)
    {
        $namespace = $this->getNamespace($object);
        $package = substr($namespace, 0, strpos($namespace, '\\'));
        if (!$package) {
            $package = 'project';
        }
        $target = strtolower($this->stripNamespace(
            $this->stripKnownTypes(get_class($object))
        ));
        $target = implode('_', array_reverse(explode('_', $target)));
        $args = compact('package', 'target', 'database');
        if ($action != 'create') {
            $args['key'] = base64_encode(serialize(['id' => $object['id']]));
        }
        return $this->url("monad/admin/$action", $args);
    }

    public function boxHead($content = '', $html = '', $class = null)
    {
        $level = 1;
        return <<<EOT
<section class="box$class"$html>
    <header class="outer"><h$level>$content</h$level></header>
    <div class="inner">

EOT;
    }
    
    public function boxFoot($content = '', $url = '')
    {
        $output = '';
        if ($content) {
            $output = <<<EOT
<p class="more"><a href="$url"><span>&raquo; $content</span></a></p>

EOT;
        }
        return $output.<<<EOT
    <hr>
</div>
</section>

EOT;
    }
    
    public function boxIcons($content = '', $html)
    {
        return <<<EOT
<b class="icons">$html</b>
$content

EOT;
    }
}

