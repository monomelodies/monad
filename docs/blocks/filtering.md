# Filtering lists
Often, a simple `SELECT * FROM <table>` is too basic for a proper admin. This is
why Monad supports _list filters_. These allow you to pass extra parameters to
the resource query, e.g. `{"someStatus":"1"}`.

## Defining a filter
Just place some HTML in your `list` template - usually between the header and
the table, but wherever really. Bind the form elements' `ng-model`s to keys
on `$ctrl.filter` and the default `moListController` will pick them up!

> If you need to use your own controller, you'll have to implement this yourself
> of course.

An example:

```html
<mo-list-header ...></mo-list-header>
<form ng-submit="$ctrl.applyFilter()"><fieldset>
    <label>
        <input ng-model="$ctrl.filter.deleted" value="1" type="checkbox">
        Show only deleted items
    </label>
    <button type="submit">Apply</button>
</fieldset></form>
<mo-list-table ...></mo-list-table>
```

Depending on your `$resource` implementation, this could result in a query such
as `/some/url?deleted=1`.

On re-filtering, Monad jumps back to page 1 since it has no way of knowing
beforehand the current page will still be available after the new filter is
applied. (TODO: use Manager.count so we CAN know this?)

## Default filter
To apply default values to a filter ("initial state"), use `ng-init`:

```html
<form ng-init="$ctrl.filter.deleted = 1"><fieldset>
    <label>
        <input ng-model="$ctrl.filter.deleted" value="1" type="checkbox">
        Show only deleted items
    </label>
    <button type="submit">Apply</button>
</fieldset></form>
```

## Auto-filtering
Manually calling `applyFilter()` makes perfect sense when your filter is a text
input ("search"), but for checkboxes or radios you might want to automatically
refresh the list when anything changes. Simply bind `$ctrl.applyFilter()` to an
`ng-change` directive on the input(s) in question in that case.

## Pagination
The most ubiquitous "filter" is of course pagination. This is done seperately
from the "normal" filters mentioned above, since one would also want to be able
to paginate filtered lists! And besides, it's customary to place a filter
_above_ the found rows and pagination _below_ them. But to visualize in database
terms: a filter is a `WHERE` clause, whereas pagination are `LIMIT/OFFSET`
options.

To be able to paginate, you need to tell Monad the total number of items in a
list. How you do that (or if it's even possible with your API...) is not up to
Monad. [Monki supports an (optionally filtered) API call to `/count/` for
this;](http://monki.monomelodies.nl) other APIs could implement their own logic.

But, assuming you've defined a `count` property on your list controller, it's
stock (Angular) Bootstrap from there:

```html
<div class="text-center" ng-if="$ctrl.count > 10">
    <uib-pagination total-items="$ctrl.count" ng-model="$ctrl.page" boundary-links="true" max-size="10"></uib-pagination>
</div>
```

To define such a property, one would extend the module definition like so:

```javascript
// The route template:
template: '<my-module-list resource="$resolve.resource" count="$resolve.count.data"></my-module-list>'
// The resolves:
{
    resource: ['moResource', moResource => moResource('/api/url/')],
    count: ['$http', $http => $http.get('/api/url/for/count/')]
}
// The component:
app.component('myModuleList', {
    bindings: {resource: '<', count: '<'},
    // Further component definitions.
});
```

The property can either come from a resolve or be something on a custom
controller - whatever your preference is.

Note that `count.data` syntax in the template binding; resolves using
`$http` get passed the "raw" success data, which is an object incluing headers
_and_ the retrieved data on a `data` property. Of course you could also use
e.g. a `$q` promise to directly pass the count, and maybe your API returns
additional data in that call (so would refer to `count.data.someProperty`).

## Generically extending resources for filtering
To extend a common `count` (or other...) implementation for your API, simply use
a custom `resource` factory that extends `moResource`. Sample implementation:

```javascript
app.factory('resource', ['moResource', function (moResource) {
    return function (url, paramDefaults, actions, options) {
        paramDefaults = paramDefaults || {};
        actions = actions || {};
        options = options || {};
        actions.count = {
            method: 'get',
            url: url.replace(/\/:id\/$/, '/')  + 'count/'
        };
        var resource = moResource(url, paramDefaults, actions, options);

        // Monki expects limit/order/offset in an "options" JSON object, so
        // let's generically rewrite the `query` method too:
        let query = resource.query;
        resource.query = function (parameters, success, error) {
            var newparameters = {filter: {}, options: {}};
            for (let i in parameters) {
                if (i == 'filter') {
                    newparameters.filter = parameters[i];
                } else {
                    newparameters.options[i] = parameters[i];
                }
            }
            return query.call(resource, newparameters, success, error);
        };
        return resource;
    };
}]);
```

If your admin talks to multiple APIs (say `wordpress` and `facebook`), just add
and inject extensions in the components where you need them:

```javascript
app.factory('wordpressResource', ['moResource', ...]);
app.factory('facebookResource', ['moResource', ...]);
```

