# CRUD with multiple models
Often, your CRUD pages will contain more complicated than just "single row
models". Consider, as an example, a ticketing system - a ticket is linked to a
submitter, followers, an assignee and perhaps other tickets or a version control
system. It would be a pain to have to write custom controllers for all such
items. Luckily, Monad offers an easier way that will suffice in most cases.

## Registering multiple callbacks
As mentioned in [the section on controllers](../components/controllers.md), each
resolved local whose name does not begin with `$` is registered on the
[CrudController](../controllers/crud.md). There is, however, one special
exception: the `$mapping` property. This should resolve to a hash with object
names (as resolved) as keys, and manager names (as resolved) as values.

> Actually, the internal default for the [CrudController](../controllers/crud.md)
> is `{item: 'Manager'}`.

The component internally transforms this to a resolvable function for Angular,
so you can just specify key/value pairs and trust the normal extension system to
work as expected.

Any mapping not found to be a Component or a Model is silently ignored, as is
any mapped Manager that is not actually a Manager. This makes it safe to add a
complete `$mapping` for all cases, but set or exclude managers and models based
on e.g. the `$routeParams` for specific cases.

> For example, a component "pages" might act differently for the homepage than
> for all other pages.

## Example
```javascript
monad.component('myComponent')
    .manager(Manager) // Assuming this is defined somewhere
    .update('/some/url/:id', {}, {
        'item': () => someitem, // Some item
        'customManager': () => resolvedManager,
        'customModel': () => someOtherModel,
        $mapping: {
            customModel: 'customManager'
        }
    });
```

