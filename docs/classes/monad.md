# Monad global object
The `Monad` class is instantiated as the `window.monad` global object. You
should use this instead of `window.angular` for application creation and
[component](../overview/main.md#adding-components) definition.

# Usage
Defining components for your admin:

```javascript
window.monad.component('componentName', ['dependencies'])
    .config({} => ());
```

Registering the main Monad application:

```javascript
window.monad.application('applicationName', ['dependencies'])
    .config({} => ())
    // ...other definitions...
    ;
```

Both methods return a new (or existing) [Component](component.md) object.

## Dependencies
`monad.application` automatically depends on any components registered before.
When manually adding dependencies (e.g. based on loading order, or when
components depend on other components) you can also pass the Component object
itself as a dependency instead of the name:

```javascript
import {someComponent} from '/path/to/someComponent';

// Assuming someComponent typeof Component...
window.monad.application('someName', [someComponent]);
```

