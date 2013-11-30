<?php

namespace monad\admin;
$title = $text('login/title');
$Css->push(
    "monad/output/css/{$project['theme']}/vertical.css",
    "monad/output/css/{$project['theme']}/login.css"
);

?>
<?=$boxHead($title, ' id="login"')?>
    <p><?=$text('./welcome')?></p>
    <form method="post" id="monad_login" action="">
        <fieldset>
            <legend><?=$text('./legend')?></legend>
            <div><label for="name">
                <span><?=$text('./name')?></span>
                <?=$form['name']?>
            </label></div>
            <div><label for="pass">
                <span><?=$text('./pass')?></span>
                <?=$form['pass']?>
            </label></div>
        </fieldset>
        <div class="buttons">
            <button type="submit" name="act_submit" value="monad_login"><?=$text('./submit')?></button>
            <hr>
        </div>
    </form>
<?=$boxFoot()?>
<?php return compact('title');

