<?php namespace monad\admin ?>
<body>
    <script>window.Monad = window.Monad || {}; window.Monad.language = '<?=$language->current->code?>'</script>
    <?=$content?>
    <script src="/monolyth/js/LAB.js"></script>
    <script>
        $LAB.script('/monolyth/js/modernizr.js');
        $LAB.script([
            '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
            '/ckeditor/ckeditor.js'
        ]).
             wait().
             script('//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js').
             wait().
             script([
                '/monolyth/js/jquery.ui.timepicker.js',
                '/monolyth/js/validator.js',
                '/monolyth/js/rangeinput.js',
                '/ckeditor/adapters/jquery.js',
                '/monolyth/js/html5.js',
                '/monolyth/js/monolyth.js',
                '/monad/js/core.js'
             ]).
             wait(function() {
    <?=$scripts ? implode('', array_unique($scripts))."\n" : ''?>
             });
    </script>
</body>

