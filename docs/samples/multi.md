# CRUD with multiple models
Often, your CRUD pages will contain more complicated than just "single row
models". Consider, as an example, a ticketing system - a ticket is linked to a
submitter, followers, an assignee and perhaps other tickets or a version control
system. It would be a pain to have to write custom controllers for all such
items. Luckily, Monad offers an easier way that will suffice in most cases.

## Registering multiple callbacks
As mentioned in [the section on controllers](../components/controllers.md), each
resolved local whose name does not begin with `$` is registered on the
`CrudController`. There is, however, one special exception: the `$mapping`
property. This should resolve to a hash with object names (as resolved) as keys,
and manager names (as resolved) as values.

> Actually, the internal default for the `CrudController` is
> `{item: 'Manager'}`.

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
        item: () => someitem, // Some item
        customManager: () => resolvedManager,
        customModel: () => someOtherModel,
        $mapping: {
            customModel: 'customManager'
        }
    });
```

Here, `$mapping` tells Monad that for the key `customModel`, it should be
handled by entry `customManager`.

## Loading extra data
Building on the above example, say we have a `ticket` with id `42`. The id is
accessed via the `$routeParams`, that's easy enough. In the same vein, we can
query all comments on a ticket by specifying e.g. the following:

```javascript
monad.component('ticket')
    .manager(Manager)
    .update('/some/url/:id', {}, {
        item: () => { /* get the ticket */ },
        comments: ['commentManager', '$route', (commentManager, $route) => {
            return commentManager.list({ticket: $route.current.params.id});
        }]
    });
```

> We need to use `$route.current.params` here, `$routeParams` isn't available
> for injection at this stage because Angular.

## Extra data based on non-URL properties
In complicated setups, it could also be you need even more data, e.g. based on
the ticket's `owner` property. Of course, this isn't included in the URL and
won't be available until the ticket actually resolves. To accomplish this, you'd
have to do something like this:

```javascript
monad.component('ticket')
    .update('/some/url/:id', {}, {
        owner: ['referenceToTicket', 'ownerManager', (ticket, ownerManager) => {
            // Of course, assuming such a derived class exists.
            let owner = new OwnerModel;
            ticket.$promise.then(ticket => {
                owner.$load(ownerManager.find({id: ticket.data.owner}));
            });
            return owner;
        }]
    });
```

The idea is that you simply return an empty Model (or Collection for that
matter; in that case you would call `fill` instead of `$load`) and fill it with
data as soon as the Promise resolves.

