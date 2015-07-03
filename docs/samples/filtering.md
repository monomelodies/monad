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

The contents of `filter` are appended to `$routeParams` and passed as a filter
verbatim, where keys are fieldnames, values are either an object (subfilter)
or the value. For subfilters, every new nesting level inverses the `AND/OR`
clause.

Values should be escaped server-side; to pass a "raw" value (i.e. verbatim,
like `CURRENT_TIMESTAMP`) use the syntax `{field: {raw: 'VALUE'}}`.

Ergo, the following filter:

```json
{foo: 'bar', {bar: 'baz', fizz: 'buzz'}}
```
...should evalute to
```sql
...WHERE foo = 'bar' AND (bar = 'baz' OR fizz = 'buzz')
```

On re-filtering, Monad jumps back to page 1 since it has no way of knowing
beforehand the current page will still be available after the new filter is
applied.

