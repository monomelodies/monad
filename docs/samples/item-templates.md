# List item templates
Sometimes, you'll need to do some massaging on how data in a list gets
displayed. E.g., the data is a string but it is a link to an image and you want
to show the image instead. Or, you even want to be able to edit certain
properties inlines - "delete row" and "copy row" are obvious examples, but one
could also imagine a blog admin where you can quickly mark entries as spam.

## Setting up item templates
First, make sure the column you want to display is in your list of columns in
the component definition. As an example, let's offer `quick delete`:

```javascript
monad.component('foo')
    // manager...
    .list('/foo/', {columns: ['bar', 'baz', 'delete']});
```

> The columns you define don't _have_ to be present in your models; if unset,
> it will default to 'empty' or `null`.

Great, we now have an empty column (assuming the `foo` items don't already
have a property `delete`: this is up to you).

Next, we add a resolve key to the `list` call with the name `templates`:

```javascript
monad.component('foo')
    // manager...
    .list('/foo/', {columns: ['bar', 'baz', 'delete']}, {templates: () => {
        return {
            'delete': 'path/to/inline/template.html'
            type: 'btn-danger',
            label: 'foo.delete',
            handle: item => {
                item.$deleted = true;
                return Manager.save(item);
            }
        }
    });
```

For each column in a list, Monad will prefer the included template if set.
This template can be very simple; we're merely going to use it to trigger a
custom directive:

```html
<button class="btn btn-danger" admin-delete="row" ng-click="delete()">
    Delete me!
</button>
```

Finally, define a custom directive:

```javascript
monad.component('foo')
    .directive('adminDelete', () => {
        return {
            restrict: 'A',
            scope: {item: '=adminDelete'},
            controller: ['$scope', 'fooManager', ($scope, Manager) => {
                $scope['delete'] = () => {
                    $scope.item.$deleted = true;
                    return Manager.save($scope.item);
                };
            }]
        };
    });
```

The `moListTable` directive (available under the name `tbody` in templates)
offers a handy `refresh` method that takes a promise and reloads the list on
success. This allows us to auto-update our list, e.g. when filtering on deleted
items:

```html
<button class="btn btn-danger" admin-delete="row" ng-click="tbody.refresh(delete())">
    Delete me!
</button>
```

## Bonus: modals
Since Monad comes with Bootstrap, you can also use the `$modal` service to show
a confirm dialogue. Since this is a common operation, Monad sports a template
for that: `../monad/directives/list/table/delete.html`. If you need a modal for
something else, use this as an example.

