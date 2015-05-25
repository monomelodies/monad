# Manager
Base Manager class providing default `list` and `find` implementations using
Angular's `$http` service, as well as an interface for various other operations.

## Usage
In virtually all cases, you'll want to create an extension of the default
Manager with project and API-specific overrides. See [the section on Managers
under Components](../components/managers.md) for some examples.

Managers are registered for a Component using the `manager` helper method. For
an application `foo` with a component `bar`, the Manager is available for
injection as `fooBarManager`:

```javascript
import {Manager} from '/path/to/Manager';

monad.component('foo', 'bar')
    .manager(Manager);
```

A custom implementation should provide `list` and `find` methods (for a
collection of models or a single model respectively). For convenience, you can
use `super` with a fully formed URL as the argument to avoid having to do
`$http` response transforms yourself:

```javascript
import {Manager as Base} from '/path/to/monad/src/services/Manager';

class Manager extends Base {

    constructor(...args) {
        super(...args);
    }

    // [...snip other methods...]

    list(some, list, of, params) {
        // Form your URL however you like:
        let url = `/${some}/${list}/${of}/${params}`;
        return super.list(url);
    }

    paginate(page) {
        // Insert the page into list wherever your parameter lives:
        return super.list(some, list, page, params);
    }

    find(another, param) {
        // Form your URL however you like:
        let url = `/${another}/${param}`;
        return super.find(url);
    }
        
};
```

For consistent APIs, you could consider writing an "intermediate" base class
that more-or-less automatically structures URLs. E.g., if parameters are always
expected in a consistent way (like `id` for a `find`) you could do something
like this:

```javascript
find(id) {
    let type = 'my_object_type'; // Usually some property on the extending class
    let url = `/${type}/${id}/`;
    return super.find(url);
}
```

## API
All managers are expected to implement the base interface:

```javascript
class Manager {

    get count() {
        // Returns the total number of entries of this type
        // (used for pagination)
    }
    
    list(...params) {
        // Returns promise resolving to a Collection of Models
    }
    
    find(...params) {
        // Returns promise yielding Models found using params (usually
        // taken from $routeParams)
    }
    
    create(item) {
        // Create item (which is a Model), return promise.
    }
    
    update(item) {
        // Update existing item Model, return promise.
    }
    
    ['delete'](item) {
        // Delete existing item Model, return promise.
    }

}
```

- #### count ####

    Virtual property that should return the total number of items available.
    This value is used for pagination.

- #### list(url) ####

    Method returning a promise resolving to a
    [Collection](../classes/collection.md) of [Models](../classes/model.md).

- #### paginate(page, params) ####

    Method return a call to `list` with the correct page injected. $routeParams
    are passed as the second argument.

- #### find(url) ####

    Method returning a promise resolving to a [Model](../classes/model.md).

- #### save(Model) ####

    Convenience method accepting a Model, and returns create, update or delete
    as appropriate. If the model is pristine, an empty object is returned.

- #### create(Model) ####

    Method returning a promise that attempts to create the model passed as an
    argument.

- #### update(Model) ####

    Method returning a promise that attempts to update the model passed as an
    argument.

- #### delete(Model) ####

    Method returning a promise that attempts to delete the model passed as an
    argument.

- #### http ####

    Virtual property exposing the central `$http` service. This also handles
    caching.

