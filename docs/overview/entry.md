Your admin application will need an entry point. This is the main script that
Browserify will use to bundle all modules from. To be ready for ES6-capable
browsers, we recommend to make your entire `admin` source code (including
Monad itself) publicly available.

    > Since Monad is just a bunch of Javascript, this shouldn't matter; if your
    > Javascript contains something super-secret you're Doing It Wrong(tm)
    > anyway.

The _entry point_ loads everything you need - Monad, your project-specific
modules and any external plugin modules you might want to use.

Let's assume our project is called `FooBar`, so `./httpdocs/admin/foobar.js`
would make a good entry point.

    > The name is irrelevant; it's just the starter file the Browserify call in
    > your build script needs to know about.

    // ./httpdocs/admin/foobar.js
    // Note: in all subsequent examples `./httpdocs/admin` will be implied.
    "use strict";
    import {default as Monad} from './monad/monad';
    var admin = angular.module('monad', [Monad]);
    // Now, register stuff on `admin`

Monad assumes it lives in an _AngularJS_ module called `monad`. The default
prefix used is `mo`, e.g. `mo-a-directive` or `moActionController`. It is good
practice to also prefix your custom components; for the `FooBar` demo we might
use `foobar` or `fb`.

The dependency on `Monad` is required, since that's the module Monad uses
internally to register stuff against. You should extend this with your custom
modules, as we'll see in the `Modules` section. The import is really just a
string with the module name (`monad.core`, if you must know) but this way you
won't need to remember it.
