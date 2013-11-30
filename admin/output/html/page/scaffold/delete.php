<?php

namespace monad;

$language = $self->language->current->code;
$h = new Box_Helper();
$txt = $self->text('scaffold/back', $self->database);
$uri = isset($_GET['redir']) ? base64_decode($_GET['redir']) : $actions[''];
$title = $self->text("scaffold/$action/title");
echo $h->using($title)
       ->icons('<a href="'.$uri.'" class="up" title="'
            .htmlentities(strip_tags($txt)).'">'.$txt.'</a>'
        )
       ->head();

echo <<<EOT
    <div style='text-align: center;'>
        <h3>Let op!</h3>
        U staat op het punt om de volgende gegevens te verwijderen:
    </div>
EOT;

echo $self->view(
    ['monolyth\render\form\slice/table', 'monolyth\render\form\slice/form'],
    compact('form')
);
echo <<<EOT
    <div>
        <h3>Let op!</h3>
        Weet u zeker dat u dit wilt verwijderen? Als u het heeft verwijderd,
        kunt u dit niet meer ongedaan maken.
    </div>
EOT;

echo $h->using('')->foot();

return compact('title');
