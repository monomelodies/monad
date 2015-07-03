# Filtering lists
Often, a simple `SELECT * FROM <table>` is too basic for a proper admin. This is
why Monad supports _list filters_. These allow you to pass extra parameters to
the Manager, e.g. `{"someStatus":"1"}`.

## Defining a filter
As a custom resolve on your `monad.list` call, add a `filterUrl` parameter. This
must point to an HTML snippet we shall `ng-include`:

```javascript
monad.list('/some/url/', {options}, {filterUrl: () => './some/url/template.html'});
```

> Since the `filterUrl` is a resolve, we must pass it as the return value
> of a function for Angular to understand it.

In the HTML snippet, bind your form elements to `list.filter.column` using
`ng-model`:

```html
<input type="checkbox" ng-model="list.filter.foo" value="1"> should foo be set?
```

The contents of `filter` are passed verbatim, where keys are fieldnames, values
are either an object (subfilter) or the value. How your API deals with that is
up to you; e.g., in PHP the [Monki simple API](http://monki.monomelodies.nl)
treats every new nesting level as an inverse `AND/OR` of the parent level.

Values should be escaped and validated server-side; Monad does no checking.

On re-filtering, Monad jumps back to page 1 since it has no way of knowing
beforehand the current page will still be available after the new filter is
applied. (TODO: use Manager.count so we CAN know this?)

How exactly your filter should be passed to your API is up to you; e.g., in
PHP the [Monki simple API](http://monki.monomelodies.nl) supports simply passing
it as `?filter=JSON_ENCODED_FILTER`.

## Default filter
In the same vein, you can also define a _default filter_. This filter
automatically gets applied if nothing else is selected:

```javascipt
monad.list(/*....*/, {defaultFilter: () => {
    return {
        someField: 1,
        someOtherField: 2
    };
}});
```

The default filter can be seen as the "initial state" of your filters.

## Filters and custom managers
The base Manager service itself does nothing to filters, since it has no way of
knowing how your API expects to receive them. The Manager _does_ offer an
`applyFilters` method though, which takes as a single argument an object of
`params` and returns it augmented with the current filter. You should take care
to apply that in your `list` and `count` implementations, e.g.:

```javascript
list(filter = {}, options = {}) {
    // "language" is always in the URL, but we probably don't need it:
    // (YMMV though)
    delete filter.language;
    filter = this.applyFilter(filter);
    options.limit = options.limit || 10;
    options.offset = options.offset || 0;
    return super.list('/admin-api/' + this.constructor.table + '/?filter=' + angular.toJson(filter) + '&options=' + angular.toJson(options));
}
```


