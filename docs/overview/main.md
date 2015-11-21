# Main concepts

## Central entry point
Your admin application will need an entry point. This is the main script that
Monad loads by default, after including libraries.

It's simple, really: assuming your admin lives in `/admin`, put your code in
`/admin/bundle.js` (or generate that file, see the [section on build
scripts](./build.md)).

To bootstrap Monad, your `bundle.js` needs at the very least to do this:

```javascript
import monad from '/path/to/monad/monad'
```

The imported `monad` object is what we'll work with as opposed to `angular`.
Note that for ES6 applications, you'll need to re-import this object wherever
you need it.

Next step is to register an _application_ with Monad. The "application" is your
actual admin:

```javascript
monad.application('myAwesomeAdmin', []);
```

> `monad.application` works as `angular.module`, except the module name is
> implied to be `monad`, and it instead takes an `app` parameter.

The `app` is a random name for your application; in this manual we'll use
`foobar`. It's sort of a namespace, as far as ECMAScript and Angular allow that.
You can also pass a third argument (like in `angular.module`) which is a
callable for configuration, or chain the `config` method (or `run` etc.).

> In a real-world application, of course you'd configurate a module either with
> the third argument, *or* by manually calling `config`. Both are allowed, but
> using them together is useless obfuscation.

## Adding components
A Monad admin is built out of "components", which are sort-of like a cross
between ES6 modules and Angular modules.

For this, use `monad.component`, which takes the same arguments as
`angular.module`, but returns a `Component` object instead:

```javascript
let component1 = monad.component('foobarFoo', [...optionalDependencies], configFn)
    .config(configFn);
let component2 = monad.component('foobarBar', [...optionalDependencies], configFn)
    .config(configFn);
// etc.
```

Note that when using components, the call to `monad.application` automatically
adds dependencies on previously registered components (as well as `monad.core`).
Hence, this code:

```javascript
let component1 = monad.component('foobarFoo');
let component2 = monad.component('foobarBar');
monad.application('foobar');
```

...will result in a `monad` Angular module with dependencies on `foobarFoo`,
`foobarBar` and `monad.core`.

> It is a good practice to prefix your custom component names with an app name,
> but technically it's not required so you can also add external components.
> If you're building a "plugin" component, it should never call
> `monad.application` though - there can be only _one_ "application". Also, for
> plugin components, you'll _definitely_ want to "namespace" them with a prefix
> to prevent possible naming clashes.

As soon as all components are defined, register the main application using
`monad.application`. This automatically injects dependencies on all known
components.

This implies you first setup components, then your application. In ES6, this
actually makes the most sense:

```javascript
import component1 from '/path/to/component/1/';
import component2 from '/path/to/component/1/';
monad.application('foobar');
```

## Showing up in the menu
For components to show up in a menu, call `monad.navigation` with an array of
known Component objects to add (this is why we were storing them in variables,
by the way):

```javascript
monad.navigation([component1, component2]);
```

The second argument is the menu name, which defaults to `main` (the top menu).
Note that components will only show if they specify a `list` action (see below).

## Getting stuff done
Obviously you'll also need your components to _do_ something. Monad extends the
default Angular module with some handy methods for that:

```javascript
monad.component('foobar')
    .manager(Manager)
    .list(url, options, resolve)
    .create(url, options, resolve)
    .update(url, options, resolve);
```

These utility methods are explained in more depth in subsequent chapters, but
the important parts are:

- A *Manager* is your custom class that handles actual data operations
  (usually via an API);
- The `list` method registers code to list items;
- The `create` method registers code to create items.
- The `update` method registers code to update items.

"No `delete`", I hear you think? Nope; that's an API operation and does not
require any special handling (your Manager of course must handle it).

The `options` and `resolve` objects are passed - augmented with defaults - to
Angular's `$routeProvider.when` method. The `url` parameter is prefixed with
`/:language` for convenience.

The Manager is registered with Angular under `appComponentnameManager` for
future injection. Capitalization is handled in a basic manner, i.e. you don't
have to capitalize your component. Ergo, for an app `foobar` the component `baz`
will have a `foobarBazManager`.

For detailed information on the various utility methods and their arguments,
see the [section on Components](../components/setup.md).

