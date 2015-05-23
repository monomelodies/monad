# Integrating CKEditor
Most web admins will at one point or another require a WYSIWYG text editor for
HTML content. Luckily, using Monad and Angular makes integrating something like
CKEditor (which is a bit of an industry standard) relatively easy.

## Install the plugin
Assuming you're using Bower (and if you're not, you really should):

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

## Prepend CKEditor to your bundle
CKEditor needs to be included _before_ any of the other libraries. This requires
a slight modification to our build script. In Gulp:

```bash
$ npm install gulp-add-src --save-dev
```

```javascript
// gulpfile.js
// along with other dependencies:
var addsrc = 
gulp.task('someTask', function() {

    gulp.src('/some/entry/point.js')
        // [snip other operations]
        pipe(addsrc.prepend(['/ckeditor/settings.js', '/path/to/ckeditor/ckeditor.js'])
        pipe(concat('bundle.js'))
        // output as normal
        ;

});
```
What this does is prepend the CKEditor library _and_ a settings file to your
bundled admin scripts.

## Local CKEditor settings
What should be in that settings file? Not much:

```javascript
window.CKEDITOR_BASEPATH = '/public/path/to/ckeditor/';
```
This _must_ be defined _before_ CKEditor loads for it to work.

> CKEditor is notoriously picky about loading order; ideally you'd do something
> like `document.head.insertNode('<script/>')`, but that won't work. Other
> external plugins could suffer the same fate.

If you use Browserify or the like you could probably also add CKEditor there,
but since it's already minified and has no dependencies of its own simply
dropping it in is usually faster and easier, and will work just as well. This is
globally the same as manually adding a `<script>` tag to your `index.html`.

