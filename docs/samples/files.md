# File uploads
Monad doesn't handle file uploads natively, since it's after all a client side
framework. But, here is how _we_ would implement it in our admins. Let's assume
all file uploads are made to a central point in your API. We'll call it
`/api/file/` in these examples.

## Using Angular
This assumes the [angular-file-upload](https://github.com/danialfarid/angular-file-upload)
plugin. Install it in your project (example in Bower) and add it as a
dependency:

```bash
$ bower install --save-dev ng-file-upload
```

If you're using Gulp and Browserify, add it to your `files` entry:
```javascript
browserify([
    './bower_components/ng-file-upload/ng-file-upload-all.js',
    //...other dependencies...
    './path/to/public/admin/foobar.js'
]);
```
> If your build setup is different, modify accordingly. The important thing is
> the custom Angular module needs to be included somewhere before
> `angular.bootstrap` has kicked in. Adding it to your `bundle.js` is the
> easiest way to accomplish that.

Then add the module dependency to your Monad application:
```javascript
monad.application('foobar', ['ng-file-upload']);
```

### Option 1: write a custom controller
In your `schema.html` or `list.html` (or wherever you need the upload option),
add a link to `angular-file-upload`:

```html
<a ngf-select ngf-change="crud.upload($files)" ng-model="crud.item.property" href>
    click to upload files!
</a>
```

(The above assumes we're doing it on a create/update page - `crud` - and we want
to store the upload in `item.property`.)

> `angular-file-upload` supports many more options; see its documentation.

Now, we need our controller to handle that:

```javascript
import {CrudController} from '/path/to/monad/src/controllers/CrudController';

let upl;

class CrudWithUploadController extends CrudController {
    
    constructor(...args, Upload) {
        super(...args);
        upl = Upload;
    }

    upload($files) {
    }

};

CrudWithUploadController.$inject = CrudController.$inject.concat(['Upload']);

export {CrudWithUploadController};
```

...and in our entry point:

```javascript
monad.component('foobar', 'upload')
    .update('/some/url/:id/', {controller: CrudWithUploadController});
```

We've added an extra dependency on `Upload`. This is the service
`angular-file-upload` provides. The `upload` method on the controller is where
the magic happens, so let's write a simple implementation:

```javascript
class CrudWithUploadController extends CrudController {

// ...as above...

    upload($files) {
        $files.map(file => {
            upl.upload({
                url: '/api/file/',
                // You'll probably want this parameter, since uploading
                // typically requires a valid session. But it depends on
                // your authentication scheme:
                withCredentials: true,
                file: file
            }).progress(evt => {
                // Example of showing progress percentage:
                console.log(Math.round(100.0 * evt.loaded / evt.total));
            }).success((data, status, headers, config) => {
                // Done! This should do something useful, e.g.:
                this.item.property = data.id;
            });
        });
    }

};
```

### Option 2: write a custom directive
In larger projects, it's typical for file uploads to be in multiple places. You
should write your own directive in that case:

```javascript
monad.application('foobar')
    .directive('foobarUpload', ['Upload', Upload => {
        return {
            restrict: 'A',
            require: ['ngModel', 'ngfSelect'],
            controller: ['$scope', $scope => {
                $scope.upload = $files => {
                    $files.map(file => {
                        Upload.upload({
                            url: '/api/file/',
                            // You'll probably want this parameter, since uploading
                            // typically requires a valid session. But it depends on
                            // your authentication scheme:
                            withCredentials: true,
                            file: file
                        }).progress(evt => {
                            // Example of showing progress percentage:
                            console.log(Math.round(100.0 * evt.loaded / evt.total));
                        }).success((data, status, headers, config) => {
                            // Done! This should do something useful, e.g.:
                            this.item.property = data.id;
                        });
                    });
                }
            }]
        }
    }]);
```

...so you can do this in any template requiring an upload:

```html
<a ngf-select ngf-change="upload($files)" ng-model="crud.item.property" foobar-upload href>
    click to upload files!
</a>
```

The `property` property will likely also vary, so you would extend your
directive to take that from an attribute.

## In CKEditor
> There are Angular modules that handle this in a pure Angular sense. To be
> honest, we haven't tried them. Google is your friend. This is just a stock
> CKEditor implementation.

The basic idea is that you extend your CKEditor configuration with a few URLs
that handle the file selection. Assuming you need it available globally, you
would do this:

```javascript
monad.application('foobar')
    .value('ckeditor', {
        filebrowserBrowseUrl: '/api/browse/file/',
        filebrowserImageBrowseUrl: '/api/browse/image/',
        filebrwoserFlashBrowseUrl: '/api/browse/flash/'
    });
```

(The exact URLs are random of course; use what you like.) Now pass that value
into the `ckeditor` directive as an argument (quite how you expose this is up to
you - probably you'll want to extend the root controller or something).

Then in your backend, make sure those URLs serve an HTML page showing thumbnails
or whatever. For each selectable file, on selection call a CKEditor function on
the opening window with two parameters: a function number (passed through a
`GET` parameter called `CKEditorFuncNum`) and the public URL of that file. E.g.:

```html
<a href="/url/to/file/1"
    onclick="window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, '/url/to/file/1')">
    select file 1
</a>
```

Exactly how you get to the value of `CKEditorFuncNum` is of course
language-specific. In PHP for instance, it'd obviously be
`$_GET['CKEditorFuncNum']`.

You can then do fancy stuff like:
- Auto-closing the popup after selection (`window.close()`);
- Augmenting the popup with an insta-upload field (note that to use Angular for
  that again, you need to set your popup up correctly; the popup won't "know"
  about Monad natively);
- Show different types of files based on the type (images, flash, others);
- ...well, whatever you want to do with your files!

