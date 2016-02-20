# Monad models
We saw earlier how we wrapped `$resource` calls in an `moResource` factory. This
is so that we can actually deal with "models" instead of plain Javascript
objects.

> Monad models offer a bunch of advantages: dirty checking, guesstimated titles,
> soft deletion etc. Also the `moResource` factory extends the `Array` object
> returns by Angular's `$resource.query` method with a `save` method so you can
> transparently append empty objects on creation.

## Dirty checking
This allows us to perform various tricks, mostly useful in the CRUD view. E.g.,
we could cause an entire section to only show up if something was edited on the
model (that's actually what `moUpdate` does to its submit button):

```html
<div ng-if="$ctrl.data.myModel.$dirty">YOU CHANGED ME!!!</div>
```

> Angular forms offer the `ng-pristine`/`ng-dirty` class for this, but it won't
> reset the state if you undo a change. Monad models are only marked dirty if
> the current value _actually differs_ from the initial one.

## Soft-deleting a model
Set `$deleted` to something truthy like so:

```html
<a href ng-click="someItem.$deleted = true">Delete me</a>
```

The model is now marked as "to be deleted" and will get deleted when the user
saves the page. Hence, it's good practice to do something like the following:

```html
<div ng-class="{deleted: someItem.$deleted}">
    <a ng-if="!someItem.$deleted" href class="glyphicon glyphicon-trash pull-right" ng-click="someItem.$deleted = true"></a>
    <a ng-if="someItem.$deleted" href class="glyphicon glyphicon-refresh pull-right" ng-click="someItem.$deleted = false"></a>
</div>
```

This will show nice trashcan/restore icons depending on the state, and add a
"deleted" class to the wrapping `<div>` if applicable. (How you style that is up
to you - a simple `opacity: .5` for instance.)

> Important: auto-saving models on a CRUD page requires the models to be bound
> to the `$ctrl.data` binding, e.g. `$ctrl.data.someItem`, and contain
> resource(s) returned by the `moResource` factory.

## Appending to lists
If `$ctrl.data.list` contains a `query` (array) of list items (e.g. subitems
related to the main item we're editing, like an article with associated images)
it's trivial to append one:

```html
<a href ng-click="$ctrl.data.list.push({})">Add an item</a>
```

Note that this only works if you've used `moResource` to query that API. Apart
from that, lists are simple (augmented) arrays you can just use in `ng-repeat`
and other code like you normally would (`ng-if="$ctrl.data.list.length"` etc.).

