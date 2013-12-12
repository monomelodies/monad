<?php namespace monad\admin ?>
<article id="menu-container" class="monad-nomenu">
    <h1>No main menu defined</h1>
    <p>
        Since <code>Monad 0.24.0</code>, the admin menu is no longer stored
        in the database (<code>monad_admin</code> and <code>monad_admin_item</code>),
        but rather in highly configurable flat files. This makes adding or
        changing the admin menu much faster! Yay.
    </p>
    <p>
        Please refer to <code>vendor/monad/core/Menu_Model</code> for details
        on how to (re-)add your menus, but the tldr; is: you're seeing this
        message because I couldn't find the file <code>admin/config/menu.php</code>.
    </p>
</article>

