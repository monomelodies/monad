# Integrating CKEditor
Most web admins will at one point or another require a WYSIWYG text editor for
HTML content. Luckily, using Monad and Angular makes integrating something like
CKEditor (which is a bit of an industry standard) relatively easy.

## Install the plugin
```sh
$ npm install ckeditor angular-ckeditor --save-dev
```

> There are other CKEditor plugins for angular; use the one you like best.

CKEditor needs to live in a public place so it can load images, styles, plugins
etc.

```sh
$ cd /my/public/admin/dir
$ ln -s /path/to/bower_components/ckeditor .
```

Or, alternatively (and this is the preferred method if you can), set up your
webserver with an alias. Note that CKEditor itself is installed using Bower, not
NPM.

## Loading the Javascript for CKEditor
CKEditor needs to be included _before_ any of the other libraries. It also wants
a `CKEDITOR_BASEPATH` global "constant" to be defined. CKEditor is notoriously
picky here. The best way to handle this is to replace `index.html` in your admin
folder with something dynamic and alter the HTML manually (or, if you're using
an overwrite anyway, simply adapt it). This example is in PHP, but any server
side language will do:

```php
<?php

// Replace this with the correct path, obviously:
$html = file_get_contents('/path/to/node_modules/monad-cms/index.html');
echo str_replace(
    '<script src="bundle.js"></script>',
    <<<EOT
<script>window.CKEDITOR_BASEPATH = '/ckeditor/'</script>
<script src="/ckeditor/ckeditor.js"></script>
<script src="bundle.js"></script>

EOT
    ,
    $html
);
```

You'll also need to change your entry point and import the Angular module for
CKEditor:

```javascript
import monad from 'monad-cms/monad';
import 'angular-ckeditor/angular-ckeditor.js';

// ...and then your normal admin code...
```

## Registering the dependency
In your call to `monad.application`, add the dependency on the `ckeditor`
module:

```javascript
monad.application('foobar', ['ckeditor']);
```

## Add the attribute where you need it
Usually this will be in `schema.html`:

```html
<mo-update>
    <mo-field>
        <label>WYSIWYG!</label>
        <textarea ckeditor="options_expression" ng-model="crud.item.the_field"></textarea>
    </mo-field>
</mo-update>
```

