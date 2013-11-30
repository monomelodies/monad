<?php

namespace monad;
use monolyth\model\ModelAbstract as Model, monolyth\Link;
$h = new helper\decorate\Box();

?>
<div class="generic-2col">
    <div class="objectlist">
<?php

$this->publish(
    new view\PHP('monad\slice/generic/list/model'),
    '\monad\controller\Data_Model::browse'
);

?>
    </div>
<?php

$link = Link::get('Monad_Data_Model::insert', $this->database, $this->model);
$txt = $this->text('monad\model/browse/insert', $this->model);
echo $h->using($this->text('monad\model/browse/title', $this->model))
       ->icons('<a href="'.$link.'" class="insert" title="'.
                htmlentities(strip_tags($txt)).'">'.$txt.'</a>')
       ->head(1, ' id="modelbrowse"');
$list = $o['getList']();
$this->publish(
    new view\PHP("monad\\slice/generic/list/{$list[$o::TYPE]}"),
    $o
);
echo $h->using('')->foot();

?>
</div>
<hr class="clear both"/>
