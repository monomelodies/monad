Monad offers an extensible and flexible service for file uploads, based on
[angular-file-upload](https://github.com/danialfarid/angular-file-upload). Its
usage depends on your exact setup, but let's assume all file uploads are made
to a central point in your API. We'll call it `/api/file/`.

## Option 1: write a custom controller
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

## Option 2: write a custom directive
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

