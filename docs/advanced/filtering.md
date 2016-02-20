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
<form><fieldset>
    <label>
        <input ng-model="$ctrl.filter.deleted" value="1">
        Show only deleted items
    </label>
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
        <input ng-model="$ctrl.filter.deleted" value="1">
        Show only deleted items
    </label>
</fieldset></form>
```

## Pagination
The most ubiquitous filter is of course pagination. To be able to paginate, you
need to tell Monad the total number of items in a list. How you do that (or if
it's even possible with your API...) is not up to Monad.

But, assuming you've defined a `count` property on your list controller, it's
stock (Angular) Bootstrap from there:

```html
<div class="text-center" ng-if="$ctrl.count > 10">
    <uib-pagination total-items="$ctrl.count" ng-model="$ctrl.page" boundary-links="true" max-size="10"></uib-pagination>
</div>
```

The property can either come from a resolve or be something on a custom
controller - whatever your preference is.

