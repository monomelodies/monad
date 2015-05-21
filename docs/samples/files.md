Monad offers an extensible and flexible service for file uploads, based on
[angular-file-upload](https://github.com/danialfarid/angular-file-upload). Its
usage depends on your exact setup, but let's assume all file uploads are made
to a central point in your API. We'll call it `/api/file/`.

## Using Angular

### Option 1: write a custom controller
In your `schema.html` or `list.html` (or wherever you need the upload option),
add a link to `angular-file-upload`:

    <a ngf-select ngf-change="crud.upload($files)" ng-model="crud.item.property" href>
        click to upload files!
    </a>

(The above assumes we're doing it on a create/update page - `crud` - and we want
to store the upload in `item.property`.)

> angular-file-upload supports many more options; see its documentation.

Now, we need our controller to handle that:

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

    // ...and in our entry point:
    monad.component('foobar', 'upload')
        .update('/some/url/:id/', {controller: CrudWithUploadController});

We've added an extra dependency on `Upload`. This is the service
`angular-file-upload` provides. The `upload` method on the controller is where
the magic happens, so let's write a simple implementation:

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

### Option 2: write a custom directive
In larger projects, it's typical for file uploads to be in multiple places. You
should write your own directive in that case:

    monad.component('foobar', 'upload')
        .directive('fooUpload', ['Upload', Upload => {
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

...so you can do this in any template requiring an upload:

    <a ngf-select ngf-change="upload($files)" ng-model="crud.item.property" foo-upload href>
        click to upload files!
    </a>

The `property` property will likely also vary, so you would extend your
directive to take that from an attribute.

## In CKEditor
This is slightly outside of the scope of these docs, but since CKEditor can be
a bit picky about this, we've included a short overview.

> There are Angular modules that handle this in a pure Angular sense. To be
> honest, we haven't tried them. Google is your friend.

The basic idea is that you extend your CKEditor configuration with a few URLs
that handle the file selection. Assuming you need it available globally, you
would do this:

    monad.application('foobar')
        .value('ckeditor', {
            filebrowserBrowseUrl: '/api/browse/file/',
            filebrowserImageBrowseUrl: '/api/browse/image/',
            filebrwoserFlashBrowseUrl: '/api/browse/flash/'
        });

(The exact URLs are random of course; use what you like.)

Then in your backend, make sure those URLs serve an HTML page showing thumbnails
or whatever. For each selectable file, on selection call a CKEditor function on
the opening window with two parameters: a function number (pass through a `GET`
parameter called `CKEditorFuncNum`) and the public URL of that file. E.g.:

    <a href="/url/to/file/1"
        onclick="window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, '/url/to/file/1')">
        select file 1
    </a>

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
