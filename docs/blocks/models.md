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

## Bitflags
Angular is awesome, but doesn't natively handle bitflags very well (you can't
write something like `<div ng-if="property & 1">` in a template). So Monad
models have extended functionality for assigning bitflags and easily flipping
them from your schema.

> Bitflags are integer fields where each "bit" (1, 2, 4, 8 etc.) represents a
> certain on/off property. They often come in useful for defining a list of such
> settings on an item, without having to store each value in a separate column.

After defining a model using `moResource`, call the `setBitflags` method on it.
It takes two parameters: the name of the "source" property (e.g. `"status"`) and
an object with a virtual property/bit value mapping. Like so:

```javascript
var item = moResource('/some/path/:id', {id: '@id'}).get({id: 1});
item.setBitflags('status', {'$foo': 1, '$bar': 2});
```

Now you can simply use `item.$foo` and `item.$bar` in your schema as if they
were regular properties returned by the API:

```html
<label>
    <input type="checkbox" ng-model="$ctrl.data.item.$foo"> is $foo on?
</label>
```

Often an API will handle this for you. This functionality comes in handy
mostly when your API doesn't do this natively.

> Best practice: prefix your bitflag mappings with `$` so they won't be
> persisted accidentally (and would likely cause an error on the server).

### Bitflags on lists
You can also call `setBitflags` on an `moResource.query` result. The bitflags
will be applied to each item in the list once the promise resolves, or when a
new item gets pushed.

