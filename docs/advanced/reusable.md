# Building reusable components
Certain elements of your admins will need to be shared between several projects,
and hence are more of an actual "module" in the ES6 sense. A plugin to emulate
the Wordpress CMS would be a good example. So, let's see how one would go about
building such a reusable "plugin" component.

At heart, a reusable component is just an Angular module with a dependency on
Monad. The trick is in making it configurable; e.g., one application might use
`/wp-api/` to access the Wordpress API, another one might use
`/a/really/custom/path/api/` for the same purpose.

## Angular values and constants
Monad just bungs some configurations on the `$rootScope`, but that's not good
enough here. What we want is to inject values using Angular's `value` and
`constant` providers (where applicable) and let the reusable component define
defaults that an implementor can override. See AngularJS documentation for more
information on these.

> The difference between "value" and "constant" is subtle (that's AngularJS's
> doing, by the way). Mostly you'll want to use "value", unless you need it
> during config phase, in which case you'll probably want "constant".
>
> AngularJS "constants" aren't constant. See their docs for more info. They're
> just values that are global, and can be injected in slightly different places.

## Navigation
Reusable components generally should refrain from registering menu options via
`moNavigate`. The service has no "unregister" method, hence a consumer would be
confined to your choice of where to place the option and how to name it. Not
cool.

In the above example for Wordpress, however, our plugin would supply _many_ URLs
to register on the navigation. That's also not cool. What you should do in these
cases is let the plugin supply a custom service (e.g. `mowpNavigation`) with
some methods that handle the defaults. The implementor can then always override
them. E.g.:

```javascript
mowp.service('mowpNavigation', ['moNavigation', function (moNavigation) {
    var self = this;
    this.posts = function () {
        // moNavigation.option() calls for post-related URLs
    };
    this.comments = function () {
        // Same for comments
    };
    // etc.
    this.all = function (exclude) {
        exclude = exclude || [];
        ['posts', 'comments', ...].map(fuction (fn) {
            if (exclude.indexOf(fn) == -1) {
                self[fn]();
            }
        });
    };
}]);
```

You can make such a service as configurable and complex as you wish or need.

## Best practices
To avoid naming conflicts, reusable components should "namespace" all their
provided components, controllers, services etc.etc.etc. with the name of the
component. E.g., if we named our component `"mowp"` for a Wordpress plugin, it
should define stuff like a `mowpPostList` component.

The same generally goes for URLs your plugin defines; prefix them with (in this
example) `/mowp/`. So you'd end up with stuff like `/:language/mowp/post/:id/`.

When loading resources, use the `moResource` factory. If you need an extension,
again prefix your custom factory with your component's base name (e.g.
`mowpResource`).

## Folding your plugin into the main CMS
Either publish your plugin using NPM of Bower, or manually place it somewhere
your admin will know about it. After that, it's simply a question of:

1. Letting your main module (or a submodule) depend on it via
   `angular.module('myadmin', ['monad', 'wpmo']);`
2. Adding the desired options to the navigation service.

