<?php

header("Content-type: text/html; charset=utf8");
$type = substr($media['mimetype'], strrpos($media['mimetype'], '/') + 1);
if ($type == 'jpeg') {
    $type = 'jpg';
}

?>
<!doctype html>
<html><body>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script>
<?php if (isset($_GET['redir'])) { ?>
/**
 * @see http://docs.cksource.com/CKEditor_3.x/Developers_Guide/File_Browser_%28Uploader%29/Custom_File_Browser
 */
// Helper function to get parameters from the query string.
function getUrlParam(paramName)
{
    var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i');
    var str = '<?=urldecode($_GET['redir'])?>';
    var match = str.match(reParam);
    return (match && match.length > 1) ? match[1] : '';
}
window.opener.CKEDITOR.tools.callFunction(
    getUrlParam('CKEditorFuncNum'),
    '<?=$url('monad/admin/media', ['id' => $media['id'], 'type' => $type])?>'
);
window.close();
<?php } else { ?>
window.parent.Monad.file.done(<?=json_encode([
    'id' => $media['id'],
    'alt' => $media['originalname'],
    'src' => $url('monad/admin/view_file', ['id' => $media['id']]),
])?>);
<?php } ?>
</script></body></html>

