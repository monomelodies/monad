# Integrating CKEditor
Most web admins will at one point or another require a WYSIWYG text editor for
HTML content. Luckily, using Monad and Angular makes integrating something like
CKEditor (which is a bit of an industry standard) very easy.

## Install the plugin
Assuming you're using Bower (and if you're not, you really should):

```bash
$ bower install ckeditor angular-ckeditor --save
$ cd /my/public/dir
$ ln -s /path/to/bower_components/ckeditor .
```

## Get the template to actually load CKEditor
CKEditor needs to live in a public path. Also, it needs to be included _before_
any of the other libraries. This means we can no longer use the default Monad
template and symlink or copy it into our admin directory. Bummer!

Luckily, we thought of a solution that is trivial to implement in just about
any server side language using basic string replacement. At the bottom of the
default `index.html` you'll see the following:

```html
<!-- monad.libraries { --><script src="../monad/libraries.js"></script><!-- } monad.libraries -->
<!-- monad.bundle { --><script src="../monad/bundle.js"></script><!-- } monad.bundle -->
<!-- project.bundle { --><script src="bundle.js"></script><!-- } project.bundle -->
```

Oh happy days! Each Javascript load is surrounded by meaningful HTML comments.
This of course means we can augment them! Remove the symlink to `index.html`
from you public admin directory and replace it with a index file in your
language of choice, loading the original `index.html` as a string and ouput it
replacing Javascript or whatnot when and where you need. Below is a simple
example in PHP, assuming we have the `ckeditor` folder publicly available from
the root:

```php
<?php

$index = file_get_contents('/path/to/monad/index.html');
$index = str_replace(
    '<!-- monad.libraries {',
    // Leave the comment in so further replacements will also work:
    '<script src="/ckeditor/ckeditor.js"></script>'."\n<!-- monad.libraries {",
    $index
);
echo $index;

```

> CKEditor is notoriously picky about loading order; ideally you'd do something
> like `document.head.insertNode('<script/>')`, but that won't work. Other
> external plugins could suffer the same fate, so this trick always works.

