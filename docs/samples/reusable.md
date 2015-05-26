# Building reusable components
Certain elements of your admins will need to be shared between several projects,
and hence are more of an actual "module" in the ES6 sense. The next example on
[building a Wordpress plugin](wordpress.md) is a fine candidate. So, let's first
look at how one would go about building such a reusable "plugin" component.

> Of course, you can still add "normal" Angular modules, but they won't be in
> the "Monad structure" with lists, managers etc.

## Basic concepts
Since we're building a plugin, it needs to live in its own "namespace". For our
"foobar" demo app, let's build a "fizzbuzz" plugin.

> Technically, a "namespace" isn't required at all, but is highly recommended
> for clarity and to avoid naming clashes. Just do it!

We saw earlier that Components are automatically injected into the main
application as a dependency. Obviously this also goes for plugins, so if our
`fizzbuzz` plugin were to define `list` methods on the main menu, they would
simply show up. However, often an external module will need some tweaking and
overrides. That's why we're not going to use the call to `monad.component` in
the module's definition files, but rather hook into the low level Component API
and leave the wiring together to the consuming application:

```javascript
// Entry point for the module, by convention:
// `/path/to/module/fizzbuzz/angular.js`
import {Component} from '/path/to/monad/src/classes/Component';

let fizz = new Component('fizzbuzz/fizz');
let buzz = new Component('fizzbuzz/buzz');
// Call `list`, `update` etc. as needed...
export {fizz, buzz};
```

Note that the "namespace" looks like a path part, which is what it's used for!
The module `fizzbuzz` lives under (e.g.) `/admin/fizzbuzz/`. When registering
components, the slahes are automatically replaced where necessary by Monad. So,
a [Manager](../services/manager.md) on `fizzbuzz/fizz` will become a
`fizzbuzzFizzManager` and if it should show up in a menu, the text string will
become `monad.navigation.fizzbuzz.fizz`.

On your custom components, define whatever you need for it to work. Always
assume that any dependencies should be handled by the component itself, so it
will truly be "drop-in".

## Hooking into the main application
In stock AngularJS, you would simply add the plugin module name as a dependency
and start using whatever you like. Monad takes that concept a bit further. After
all, by using the low level API nothing actually happened yet with respect to
Monad component registration; we just have a bunch of Component objects.

A Monad component can also _extend_ another component. This means the component
will then take its defaults from the component it extends, instead of from the
normal component defaults:

```javascript
import {fizz, buzz} from '/path/to/fizzbuzz/angular';

monad.component('myCustomFizz')
    .extends(fizz)
    .list() // Takes all options from fizz.list
    // etc.
    ;
```

The parameter to `extends` can be either the name of an
already-registered-component, or the component object itself. When using the
literal name as a string, of course it has to be registered with
`monad.component` first, and could should up in the menu.

You can pass multiple arguments to `extends`; the extension will happen in
order and incrementally. E.g., if you extend component `foo` that defines a
`list` method and component `bar` that defines an `update` method, the
extending object will have both methods.

> The arguments are processed in order, so for non-enumerable properties, the
> last argument will always take precedence.

You can also simply call `extends` multiple times; the result is the same.

## Overriding the defaults
Whenever a component `extends` another component, its settings are stored but
not actually applied until the bootstrapping phase. This allows for some very
flexible overrides, e.g. this will work:

```javascript
let custom = new Component('custom1');
custom.list('/custom/', {columns: ['a', 'b', 'c']});

monad.component('custom2')
    .extends(custom)
    .list('/whatever/'); // The ListController still has columns a, b and c
```
...but so will this:
```javascript
let custom = new Component('custom1');
custom.list('/custom/', {columns: ['a', 'b', 'c']});

monad.component('custom2')
    .list('/whatever/') // The ListController eventually inherits the columns
    .extends(custom);
```

The rule of thumb is that the _native_ settings for a Component take precedence,
and are augmented by defaults and/or components that are extended.

> For the record, extending a component in no way changes the original
> Component.

