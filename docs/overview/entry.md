Your admin application will need an entry point. This is the main script that
Monad loads by default, after including libraries and its own bundle.

It's simple, really: assuming your admin lives in `/admin`, put your code in
`/admin/bundle.js` (or generate that file, see the section on build scripts).

## Main entry point
Monad assumes an Angular module called (unsurprisingly) `monad`. There is a
global object `monad` which "extends" the global `angular` object. Hence, to
define your main application's entry point (e.g. in `./src/admin/foobar.js`, the
actual filename is irrelevant as long as it transpiles to
`./httpdocs/admin/bundle.js`) you would simply do the following:

    monad.application(app, [...optionalDependencies], configFn).config(configFn);

> `Monad.application` works as `Monad.module`, except the module name is implied
> to be `monad`.

The 'app' is a random name for your application; in this manual we'll use
'foobar'. It's sort of a namespace, as far as ECMAScript and Angular allow that.

> In a real-world application, of course you'd configurate a module either with
> the third argument, or by manually calling `config`. Both are allowed.

## Adding components
Of course, you'll want to separate your admin code into modules (in the Angular,
ES6 and Monad sense). For this, use `monad.component`, which takes an app name
plus the same arguments as `angular.module`, but returns a `Component` object
instead:

    monad.component('foobar', 'foo', [...optionalDependencies], configFn)
        .config(configFn);
    monad.component('foobar', 'bar', [...optionalDependencies], configFn)
        .config(configFn);
    // etc.

Note that when using modules, the call to `monad.application` _must_ list them
as dependencies. The order in which you do this, like with `angular.module`, is
unimportant.

## Getting stuff done
Obviously you'll also need your modules to _do_ something. Monad extends the
default Angular module with some handy methods for that:

    monad.component('foobar', 'foo')
        .manager(Manager)
        .list(url, options, resolve)
        .update(url, options, resolve);

These utility methods are explained in more depth in subsequent chapters, but
the important parts are:

- A "Manager" is your custom class that handles actual data operations (usually
  via an API);
- The `list` method registers code to list items;
- The `update` method registers code to create or update items.

"No `delete`", I hear you think? Nope; that's an API operation and does not
require any special handling (your Manager of course must handle it).

The `options` and `resolve` objects are passed - augmented with defaults - to
Angular's `$routeProvider.when` method. The `url` parameter is prefixed with
`/:language` for convenience.

The Manager is registered under `appComponentnameManager` for future reference.
Capitalization is handled in a basic manner, i.e. you don't have to capitalize
your component. Ergo, for an app `foobar` the component `baz` will have a
`foobarBazManager`.

