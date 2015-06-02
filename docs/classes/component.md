# Component
Low-level API to defining Monad components.

## Usage
The following use is typical when building
[reusable components](../samples/reusable.md). For day-to-day use, you'll
generally prefer [the monad global API](../overview/main.md#adding-components).

```javascript
import {Component} from '/path/to/monad/src/classes/Component';

let mycomponent = new Component('mycomponent');
// E.g.:
// mycomponent.list(...);
// mycomponent.update(...);
// mycomponent.manager(...);
// etc.
export {mycomponent};
```

The constructor takes three arguments: the name of the component (which doubles
as the Angular module name), an array of dependencies and a configuration
function.

> Note that a manual instantiation of a component does not in any way register
> it for automatic dependency injection in your main application.

For `update` actions, it is required that you specify the `item` to be updated
as a resolve. Typically, this will be something like this:

```javascript
{item: ['someComponentManager', '$route', (Manager, $route) => {
    return Manager.find($route.current.params).then(result => result.data);
}]};
```

## API

- #### constructor(name, dependencies = [], configFn = undefined) ####

    Constructor. The name is your Angular module name. `dependencies` are an
    (optional) array of either module names, component names or actual Component
    objects (mix and match as needed). `configFn` is an Angular configuration
    function.

    Note that these are the exact arguments `monad.component` receives, too.

- #### bootstrap(void) ####

    Bootstrap the component. This is called automatically by Monad, and thus
    should rarely be called manually. Each component has a `$bootstrapped`
    member that ensures `bootstrap` is only called once. **Note:** calling it
    twice accidentally will fail silently.

- #### extend(...components) ####

    One or more components that this component extends. **Note:** for "normal"
    Angular dependencies, use the `dependencies` argument in the constructor.

- #### authenticate(auth) ####

    Set the authentication resolve for this module.

- #### list(url, options = {}, resolve = {}) ####

    Convenience method for registering a `list` action. `options` can take
    two custom properties:

    - ##### menu #####

        If `undefined`, `true` or a string, will register this call for that
        menu (with `main` being the menu ID if `undefined` or `true`).

    - ##### columns #####

        Array of model properties to show in the list.

- #### create(url, options = {}, resolve = {}) ####

    Convenience method for registering a `create` action. `options` can take
    a custom property:

    - ##### item #####

        Optional. An empty Model to create on. The component will automatically
        use the `model` property of its Manager if omitted.

- #### update(url, options = {}, resolve = {}) ####

    Convenience method for registering an `update` action. `options` can take
    two custom properties:
    
    - ##### item #####
    
        Required. This is the actual Model as loaded by your Manager.

    - ##### create #####

        Optional. A string that specifies the `create` URL instead.
        Most times `create` and `update` will need identical `options` and
        `resolve` arguments, just with a different URL and an empty Model for
        `create` instead of an `item` loaded by the Manager. This avoids code
        duplication.

- #### manager(Manager manager) ####

    Register the [Manager](../services/manager.md) for this component. This
    method ensures the manager is correctly registered for injection with
    Angular. It also places a `$manager` object on the component, with two
    properties: `$manager.name` is the normalised name sent to Angular, and
    `$manager.obj` is the (uninstantiated) manager class. The
    [CrudController](../controllers/crud.md) automatically registers the
    instantiated and injected manager as `this.Manager`.

