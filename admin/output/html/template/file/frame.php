<?php namespace monad\admin ?>
<body>
<?php if (!isset($_GET['disabled'])) { ?>
    <div>
        <form id="uploader" target="upload" method="post" enctype="multipart/form-data" action="<?=$url('monad/admin/upload_file')?>">
            <fieldset>
                <?=$input?>
                <button type="submit" name="act_submit"><?=$text('./upload')?></button>
                <button type="button"><?=$text('./choose')?></button>
<?php if ($media['id']) { ?>
                <a class="icon delete" id="delete_img" href="#"><?=$text('./delete')?></a>
<?php } ?>
                <input type="hidden" class="upload_name" name="<?=ini_get('session.upload_progress.name')?>" value="monad_media">
                <input type="hidden" name="id" value="<?=$media['id']?>">
                <input type="hidden" name="element" value="<?=htmlentities($_GET['element'])?>">
            </fieldset>
        </form>
        <progress max="100" value="0"></progress>
    </div>
<?php

}
if ($media['mimetype']) {
    $mimes = explode('/', $media['mimetype']);
    switch ($mimes[0]) {
        case 'image':

?>
    <div><img src="<?=$url('monad/admin/view_file', ['id' => $media['id']])?>" alt="<?=$media['originalname']?>"></div>
<?php

            break;
    }
}

?>
<iframe name="upload"></iframe>
<script src="/monolyth/js/LAB.js"></script>
<script>
$LAB.script(['//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js']).
     wait().
     script([
        '/monolyth/js/html5.js',
        '/monad/js/core.js'
     ]).
     wait(function() {
        $('body').width($('body').width());
        $('#uploader').submit(function() {
            var $this = $(this);
            $this.addClass('uploading');
            return Monad.file.upload($this);
        });
        $('#delete_img').click(function() {
            window.parent.Monad.file.remove($('[name=element]').val());
            return false;
        });
        $('body').on('load', 'img', function() {
            window.parent.resizeFileFrame($('body').height(), '<?=$media['id']?>');
            if ($('img').width() > $('body').width()) {
                $('img').width($('body').width());
            }
        });
        $(document).ready(function() {
            window.parent.resizeFileFrame($('body').height(), '<?=$media['id']?>');
            Monolyth.scripts.execute();
        });
     });
</script>
</body>
<?php

$Css->push("monad/output/css/{$project['theme']}/fileframe.css");

