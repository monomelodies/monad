# Integrating CKEditor
Most web admins will at one point or another require a WYSIWYG text editor for
HTML content. Luckily, using Monad and Angular makes integrating something like
CKEditor (which is a bit of an industry standard) relatively easy.

## Install the plugin
Assuming you're using Bower:

```bash
$ bower install ckeditor angular-ckeditor --save
```

> There are other CKEditor plugins for angular; use the one you like best.

CKEditor needs to live in a public place so it can load images, styles, plugins
etc.

```bash
$ cd /my/public/dir
$ ln -s /path/to/bower_components/ckeditor .
```

Or, alternatively (and this is the preferred method if you can), set up your
webserver with an alias.

## Prepend CKEditor to your bundle
CKEditor needs to be included _before_ any of the other libraries. It also wants
a `CKEDITOR_BASEPATH` global "constant" to be defined. CKEditor is notoriously
picky here. Open your admin entry point and add it at the _top_:

```javascript
// This comes right at the beginning:
window.CKEDITOR_BASEPATH = '/ckeditor/';
// Next, import Monad itself which contains Angular etc.
import monad from 'monad-cms/monad';
// Then import CKEditor base. Technically, you could also import this _before_
// Monad, but this way the two CKEditor calls are placed together. In any case,
// import these _after_ the `BASEPATH` "constant" is defined.
import '/path/to/bower_components/ckeditor/ckeditor.js';
// Finally, the Angular bindings for CKEditor.
import '/path/to/bower_components/angular-ckeditor/angular-ckeditor.js';

// ...and then your normal admin code...
```

> Browserify doesn't by default ignore the `bower_components` directory, and
> will thus try to transpile CKEditor. Don't worry about it, effectively it'll
> ignore it anyway since CKEditor is ES5 code.

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

