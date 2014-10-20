<?php

namespace monad\admin;

/*
$Css->unshift(
    'monolyth/output/css/reset.css',
    'monolyth/output/css/html5.css',
    'monolyth/output/js/formalize/css/formalize.css',
    'monad/output/css/layout.css',
    "monad/output/css/{$project['theme']}/{$project['theme']}.css",
    'output/css/monad.css?'
);
$Script->unshift(
    'monolyth/output/js/formalize/js/jquery.formalize.js',
    'monolyth/output/js/jquery/ui.timepicker.js',
    'monolyth/output/js/jquery/validator.js',
    'monolyth/output/js/jquery/rangeinput.js',
    'monolyth/output/js/jquery/html5.js',
    'monolyth/output/js/monolyth.js',
    'monolyth/output/js/text.js',
    'monad/output/js/core.js'
);
*/

?>
<body>
    <script>window.Monad = window.Monad || {}; window.Monad.language = '<?=$language->current->code?>'</script>
    <?=$content?>
    <script src="/monolyth/js/modernizr.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="/ckeditor/ckeditor.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
    <script src="/ckeditor/adapters/jquery.js"></script>
    <script src="/js/admin/monad/formalize/js/jquery.formalize.js"></script>
    <script src="/js/admin/monolyth/jquery/ui.timepicker.js"></script>
    <script src="/js/admin/monolyth/jquery/validator.js"></script>
    <script src="/js/admin/monolyth/jquery/rangeinput.js"></script>
    <script src="/js/admin/monolyth/jquery/html5.js"></script>
    <script src="/js/admin/monolyth/monolyth.js"></script>
    <script src="/js/admin/monolyth/text.js"></script>
    <script src="/js/admin/monad/core.js"></script>
    <script>
        var Monad = Monad || {};
        Monad.language = '<?=$language->current->code?>';
    </script>
    <script>
        Monolyth.text.setup(<?=json_encode($texts)?>);
        Monolyth.scripts.execute();
    </script>
</body>

