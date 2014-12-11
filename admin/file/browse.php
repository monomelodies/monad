<?php namespace monad ?>
<div id="filebrowser">
    <div id="create">
        <form method="post" action="" id="folder"><fieldset>
            <label for="folder_folder">
                <?=$text('./create/folder')?>
                <input type="text" name="folder" id="folder_folder">
            </label>
            <button type="submit" class="create"><?=$text('./create/submit')?></button>
        </fieldset></form>
        <form method="post" action="<?=$url('monad/admin/upload_file')
            ?>?redir=<?=urlencode($_SERVER['REQUEST_URI'])?>" enctype="multipart/form-data" id="file"><fieldset>
            <label for="file_file">
                <?=$text('./create/file')?>
                <input type="file" name="file" id="file_file">
            </label>
            <button type="submit" class="create"><?=$text('./create/submit')?></button>
        </fieldset></form>
    </div>
    <nav id="folders">
<?php

if ($folders) {
    array_unshift($folders, ['id' => 0, 'name' => '[..]', 'children' => false]);
    $flist = function($folders) use(&$flist) {
        echo "<ul>\n";
        foreach ($folders as $folder) {
            echo "<li><a href=\"#{$folder['id']}\">{$folder['name']}";
            if ($folder['children']) {
                echo "\n";
                $flist($folder['children']);
            }
            echo "</a></li>\n";
        }
        echo "</ul>\n";
    };
    $flist($folders);
}

?>
    </nav>
    <div id="files">
<?php

if ($files) {
    $ids = [0 => []];
    $idx = $i = 0;
    foreach ($files as $file) {
        if ($i && !($i % 10)) {
            ++$idx;
            $ids[$idx] = [];
        }
        $ids[$idx][] = $file['id'];
        ++$i;
    }
    $idx = -1;

?>
        <ul>
<?php

    $i = 0;
    foreach ($files as $file) {
        if (!($i % 10)) {
            $src = $url('monad/admin/multi_media', ['ids' => implode(',', $ids[++$idx]), 'size' => '80x80', 'type' => 'jpg']);
        }

?>
            <li><a href="#<?=$file['id']?>"><figure>
                <span><img style="margin-top: -<?=80 * ($i - $idx * 10)?>px"
                    src="<?=$src?>"
                    alt="<?=$file['originalname']?>"
                    title="<?=$file['originalname']?>"
                    data-id="<?=$file['id']?>"
                    data-src="<?=$url(
                        'monad/admin/media',
                        ['id' => $file['id'], 'type' => end(explode('/', $file['mimetype']))]
                    )?>"></span>
                <figcaption><?=$file['originalname']?></figcaption>
            </figure></a></li>
<?php

        ++$i;
    }

?>
        </ul>
<?php } ?>
    </div>
</div>
<?php

return ['Styles' => ["/css/admin/monad/{$project['theme']}/filebrowser.css"]];

