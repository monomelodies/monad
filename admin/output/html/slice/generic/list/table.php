<?php

namespace monad;
use monolyth\Link;
$h = new \monolyth\helper\decorate\Paragraph()

?>
<div class="model-browse"><table>
<thead><tr>
    <th colspan="3">_(monad\model/browse/actions)</th>
<?php

$fields = array();
$list = $o['getList']();
$schema = $o['getSchema']();
foreach ($list[$o::FIELDS] as $name):
    $order = $name;
    $title = strip_tags($this->text('monad\model/browse/orderby', $name));
    if ($tmp = $this->http->getGet('order')):
        if ($tmp == $name):
            $title .= ' [_(monad\model/browse/orderby.desc)]';
            $order = "$tmp&amp;dir=desc";
        endif;
    endif ?>
    <th><a href="?order=<?php echo $order ?>" title="<?php
        echo htmlentities($title) ?>"><?php echo $o['getLabel']($name) ?></a></th>
<?php endforeach ?>
</tr></thead>
<tbody>
<?php

$name = $o[0]->getTable();
foreach ($o as $cnt => $i):
    $id = base64_encode(serialize($i'[getPrimaryKeys']()));
    list($ns, $model) = $o['getModelURL']();

?>
    <tr<?php echo ++$cnt & 1 ? ' class="odd"' : '' ?>>
        <td><a class="icon edit" title="_(monad\model/browse/edit)" href="<?php
            echo Link::get('monad\controller\Data_Model::update', $this->database,
            $ns, $model, $id) ?>">_(monad\model/browse/edit)</a></td>
        <td><a class="icon delete" title="_(monad\model/browse/delete)" href="<?php
            echo Link::get('monad\controller\Data_Model::delete', $this->database,
            $ns, $model, $id) ?>">_(monad\model/browse/delete)</a></td>
        <td><a class="icon copy" title="_(monad\model/browse/copy)" href="<?php
            echo Link::get('monad\controller\Data_Model::copy', $this->database,
            $ns, $model, $id) ?>">_(monad\model/browse/copy)</a></td>
<?php
    foreach ($list[$o::FIELDS] as $id):
        $tag = 'td';
        if ($schema->{$id}->status & $i::PRIMARY_KEY):
            $tag = 'th';
        endif;
        $class = array();
        if (is_numeric($i['$id'])):
            $class[] = 'numeric';
        endif ?>
        <<?php echo $tag.($class ? ' class="'.implode(' ', $class).'"' : '')
            ?>><?php
        if ($i['$id'] instanceof \monolyth\model\ModelAbstract):
            echo $i['$id']->monadguesslabel();
        else:
            echo $h->parse(htmlentities($i['$id']), 'excerpt:25:1');
        endif ?></td>
<?php   endforeach ?>
    </tr>
<?php endforeach ?>
</tbody>
</table></div>
<?php /*else: ?>
    <p>_(No rows were found of this object-type.)</p>
<?php endif*/ ?>
<!-- end browse modellist -->

