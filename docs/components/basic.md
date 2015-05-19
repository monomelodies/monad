## Entry point
In the previous section, we already advised you to use `./mymodule/angular.js`
as an entry point for your custom modules. Now, we'll see how we can hook
everything together and turn this into a Monad module.

    // ./foobar/angular.js
    import {Repository} from './Repository';

    angular.module('foobar', ['ng'])
        .service('foobarRepository', Repository)
        // etc.
        ;

Okay, that's simple enough; just register everything your module needs on the
Angular module, using `modulename` as a prefix.

> Angular modules are kind of sucky - they only have a global namespace.
> Prefixing names is the best way to avoid accidental collisions. There are some
> other techniques (like calling `angular.injector([...module(s)]).get`
> manually), but they have significant drawbacks.

## Hooking into the administrator
Now, at this point we have a basic module, but when we point our browser
towards `http://localhost/admin/` (or whatever your URL is), we don't see it.
Well, of course not - Monad can't read your mind. There are at least two things
that need to be done: tell `ngRoute` how to access the module, and add its entry
point to the main navigation.

First things first: let's define the routes we want:

    // ./foobar/angular.js
    angular.module('foobar', ['ng', 'ngRoute'])
        .config(['$routeProvider', $routeProvider => {
            $routeProvider
                .when('/:language/foobar/', {
                    controller: 'FoobarController',
                    controllerAs: 'list',
                    templateUrl: 'foobar/list.html'
                })
                .when('/:language/foobar/:id/', {
                    controller: 'FoobarItemController',
                    controllerAs: 'item',
                    templateUrl: 'foobar/update.html'
                });
        }]);

Okay, that's straightforward enough... now, we also need to call Monad's
`moNavigation` service to register the menu item:

    import {Monad} from '../monad/src/angular';
    angular.module('foobar', [Monad])
        .config(['$routeProvider', 'moNavigation', ($routeProvider, moNavigation) => {
            // ...as before...
            moNavigation.register('main', '/:language/foobar/');
        }]);

"Augh" I can hear you scream internally, "so much typing!" *Indeed!* So instead
of `Angular.module`, let's use the provided `Module` call from Monad instead.
Like `angular.module`, this lets you define the name and dependencies of a
module, but also accepts a third argument: a config object. This lets you define
_all_ options, but will fill it with sensible defaults when any is omitted. So,
if you're building a super-default module - you can just leave it out!

    import {Module} from '../monad/src/Module';
    // Note that monad.core is assumed as a dependency.
    Module('foobar', [], {
        list: { ...config... },
        create: { ...config... },
        update: { ...config... },
        'delete': { ...config... }
    });

> You can add keys other than the CRUD defaults, but these won't be picked up
> automatically anywhere. You can still link to them using the `mo-path`
> directive manually, though.

The config object accepts all the parameters you'd usually pass to
`$routeProvider.when`, and a few extras. Anything you leave out will be
inferred; to disable a default option, pass `false`:

    Module('foobar', [], {
        list: {
            controller: 'FoobarController'
        },
        // Update and delete are inferred, but create is disabled:
        create: false
    });

> Pass `false`, not `undefined`; the latter would have the same effect as
> omitting the option, causing the default to be used!

To add a module option to the navigation, pass a key `menu` with the name of
the navigation you want it added to (`main` for the top menu, or whatever other
navigations you have):

    Module('foobar', [], {
        list: {
            //...as before...
            menu: 'main'
        }
    });

The inferred defaults are as follows (note that `url` _must_ be supplied for
`menu` to be a valid key; we can't guesstimate your URLs for you!). (Also note
that a `menu` property with a URL with a parameter makes no sense.) `$MODULE`
will be replaced with the normalized name of your module (e.g. for `foobar` it
will become `Foobar`):

    {
        list: {
            controller: 'moListController',
            controllerAs: 'list',
            model: 'moModel',
            repository: '$MODULERepository',
            templateUrl: 'template/$MODULE/list.html',
            menu: 'main'
        },
        create: {
            controller: 'moCreateController',
            controllerAs: 'item',
            model: 'moModel',
            respository: '$MODULERepository',
            templateUrl: 'template/$MODULE/create.html',
        },
        update: {
            controller: 'moUpdateController',
            controllerAs: 'item',
            model: 'moModel',
            respository: '$MODULERepository',
            templateUrl: 'template/$MODULE/update.html',
        },
        'delete': {
            controller: 'moDeleteController',
            controllerAs: 'item',
            model: 'moModel',
            respository: '$MODULERepository',
            templateUrl: 'template/$MODULE/delete.html',
        },
    }

There's still some duplication here; since it's not very probable you'll need to
define a custom model or repository seperately for each action (but more likely
for your entire module), the `model` and `repository` keys can also be defined
once alongside the actions, and will be 'hoisted'.

> Note: though you can and may override the `controllerAs` property, this does
> mean you'll also have to define your own templates and/or controller, as the
> defaults make certain assumptions in regard to naming.

## List view
When clicking on a menu item, we'll generally need a list of items of that type
to be displayed to choose from. That's easy: add the `list.html` file under the
module directory in `template` and add something like the following:

    <mo-list items="list.items" fields="['id', 'foo', 'bar']">
        <mo-list-item ng-repeat="item in list.items">
            <mo-list-item-data ng-repeat="field in item.fields"
                ng-bind-html="item.data[field]"></mo-list-item-data>
        </mo-list-item>
    </mo-list-items>

The `mo-list-items` directive gives us a nice bootstrap-table with pagination.
Every `mo-list-item` is a row with an item, and `mo-list-item-data` is a cell in
the table.
