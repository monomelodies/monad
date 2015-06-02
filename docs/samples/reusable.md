# Building reusable components
Certain elements of your admins will need to be shared between several projects,
and hence are more of an actual "module" in the ES6 sense. The next example on
[building a Wordpress plugin](wordpress.md) is a fine candidate. So, let's first
look at how one would go about building such a reusable "plugin" component.

> Of course, you can still add "normal" Angular modules, but they won't be in
> the "Monad structure" with lists, managers etc.

## Basic concepts
Registering components for your plugin works just like "normal" components (in
fact, they're the same concept, only of course with `monad.application`):

```javascript
monad.component('myplugin')
    .manager(...)
    .authentication(...)
    .list(...)
    .create(...)
    .update(...);
```

> Best practice: name subcomponents with a "namespace" referring to your plugin.
> This avoids potential naming clashes (at least, as best a possible).
> A good naming convention for plugin components would be `plugin.component`,
> e.g. `monad.component('myplugin.foo')`, `monad.component('myplugin.bar')` etc.

Which parts you need to define is up to you and your plugin. For instance, if
you don't require any special authentication, you should simply rely on the
supplied service (or "extend" it). Since the authentication is itself an Angular
service and knows nothing about resolved authentication, this is easy:

```javascript
let original;

class PluginAuthentication {

    constructor(Authentication, ...args) {
        super(...args);
        //... custom stuff...
        original = Authentication;
    }

    // This is just a proxy:
    ['status']function() {
        return original['status']();
    }

    // This does something custom:
    revoke() {
    }
        
}

// Authentication is a global service, so we can inject it:
PluginAuthentication.$inject = ['Authentication'];
```

> Best practice: if your subcomponent requires additional authentication, don't
> make too many assumptions on what or how the consuming CMS does to store
> those. Instead, you should extend the authentication API and document how
> consumers should implement it.
>
> For example, say you need to authenticate with an external API using oAuth.
> How and where the consumer (that is, the CMS) stores oAuth credentials is of
> no interest to the plugin author; she should simply mandate that the custom
> authentication service _must_ implement e.g. a `getOauth` method.

## Configurability
The most important thing to remember when you're building a reusable plugin is:
_when I use this in both project A and project B, would I need to change the
source code?_ Keep refactoring until you answer "no" to that question :)

> Best practice: for configuration, e.g. a base path for API endpoints, use
> `Component.value` or `Component.constant` as much as possible. That's what
> they're there for.
>
> The difference between "value" and "constant" is subtle (that's AngularJS's
> doing, by the way). Mostly you'll want to use "value", unless you need it
> during config phase, in which case you'll probably want "constant".
>
> AngularJS "constants" aren't constant. See their docs for more info. They're
> just values that are global, and can be injected in slightly different places.

Of course, make sure to document allowed and/or expected values for these
configuration parameters, "namespace" them as much as you can, and use logical
names.

## Folding your plugin into the main CMS
We saw earlier that Components are automatically injected into the main
application as a dependency. Obviously this also goes for plugins, so if our
`fizzbuzz` plugin were to define `list` methods on the main menu, they would
simply show up. However, often an external module will need some tweaking and
overrides. Luckily, that's easy to accomplish.

For example, let's say we've made a `fizzbuzz` plugin that defines a `list`
under the URL `/fizzbuzz/`. However, for a particular project that won't
suffice and we'd rather place that under `/foobar/`. Easy!

```javascript
// In fizzbuzz:
monad.component('fizzbuzz')
    .list('/fizzbuzz/');

// In main CMS:
import {fizzbuzz} from '/path/to/fizzbuzz';
monad.component('fizzbuzz').settings.list.url = '/foobar/';
```

> Tip: set a URL to `false` or `undefined` to remove it from a menu completely.

For heavier customisation, you might want to use your own component that extends
the plugin's, and override where necessary:

```javascript
monad.component('foobar')
    .extend('fizzbuzz')
    .manager(SomeCustomManager)
    .settings.list.url = '/foobar/';
```

If you plugin should rarely or never show up in a main menu directly, simply
add `{menu: false}` to its `list` definition (or, if there is not `list`, just
omit it).

