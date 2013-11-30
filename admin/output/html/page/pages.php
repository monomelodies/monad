<!-- monad pages -->
<div class="box" id="pagelist"><div class="boxinner"><div class="watermark">
<h2><?php echo Text::get('Monad/Available pages') ?>:</h2>
<?php if ($children = $this->models->pages): ?>
<?php else: ?>
<p><?php echo Text::get('Monad/No pages available.') ?></p>
<?php endif; ?>
<div class="buttonlist"><a
	href="/monad/add/page/"><?php echo Text::get('Monad/Create new page') ?></a></div>
</div></div></div>
<div class="box" id="currentpage"><div class="boxinner"><div class="watermark">
<h2><?php echo Text::get('Monad/Selected page') ?></h2>
<?php if (isset($this->models->current_page)): ?>
	print $this->models->current_page->__toString();
<?php else: ?>
<p><?php echo Text::get('Monad/No page selected') ?>.</p>
<?php endif; ?>
</div></div></div>
