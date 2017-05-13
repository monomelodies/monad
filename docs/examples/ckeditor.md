# Integrating CKEditor
Most web admins will at one point or another require a WYSIWYG text editor for
HTML content. Luckily, using Monad and Angular makes integrating something like
CKEditor (which is a bit of an industry standard) relatively easy.

## Install the plugin
```sh
$ npm install --save angular-ckeditor
```

> There are other CKEditor plugins for angular; use the one you like best.

Note that CKEditor itself is installed using Bower, not NPM. The NPM package is
just a wrapper. If you installed Monad using Bower to begin with, you should of
course use their Bower package directly:

```sh
$ bower install --save angular-ckeditor
```

CKEditor needs to live in a public place so it can load images, styles, plugins
etc. Either make sure `bower_components` is publicly accessible, or
symlink/copy/alias the `ckeditor` folder to a public place.

## Loading the Javascript for CKEditor
CKEditor needs to be included _before_ any of the other libraries. It also wants
a `CKEDITOR_BASEPATH` global "constant" to be defined. CKEditor is notoriously
picky here. So add the following to your admin's `index.html`:

```html
<script>window.CKEDITOR_BASEPATH = '/path/to/ckeditor/'</script>
<script src="/path/to/ckeditor/ckeditor.js"></script>
<!-- if using Bower: -->
<script src="/path/to/monad/bundle.js"></script>
<!-- ...other plugins installed using Bower... -->
<script src="/path/to/my/admin/bundle.js"></script>
```

If installed using NPM/Browserify you'll also need to `require` the Angular
module for CKEditor (Bower users would add the plugin with a `<script>` tag):

```js
// ES6
import 'angular-ckeditor';
// Browserify
require('angular-ckeditor');
```

...and in all cases, add it as a dependency to your admin module:

```js
angular.module('myAwesomeAdmin', ['monad-cms', 'ckeditor']);
// ...and then your normal admin code...
```

## Add the attribute where you need it
```html
<label>WYSIWYG!</label>
<textarea ckeditor="options_expression" ng-model="$ctrl.data.someItem.somefield"></textarea>
```

The `options_expression` is a hash of options for CKEditor. You can set it on a
custom controller, `resolve` it or even place it on `$rootScope` (which would
make sense if you have multiple CKEditor instances throughout your application
with the same settings).

