# Navigation
As per version 2, Monad uses so-called "component-based routing". In
Angular-speak this means globally the following:

- A URL (any URL, in this case e.g. `/admin/foo/`) resolves to a basic tamplate
  like `<awesome-foo></awesome-foo>`.
- Using `angular.module(...).component(...)`, define a component of that name
  (in this example that would become `awesomeFoo`).
- The component (not the router, as previously) now handles everything.

Another thing to note is that most of the times you'll actually have two related
components for each editable section: the "list" (a list of items) and the
create/update component.

Let's start by defining those routes, since we currently only have a (very basic
and default) homepage. If our components don't need any special handling (and
they won't for now, this is a tutorial after all ;)) your Javascript would look
much like the following:

```javascript
"use strict";

// Our main app depends on Monad
let app = angular.module('awesome', ['monad']);

app.config(['$routeProvider', $routeProvider => {
    $routeProvider.when('/:language/foo', {
        template: '<awesome-foo-list resource="$resolve.resource"></awesome-foo-list>',
        resolve: {resource: ['moResource', moResource => moResource('/api/foo')]}
    });
    $routeProvider.when('/:language/foo/:id', {
        template: '<awesome-foo data="$resolve.data"></awesome-foo-list>',
        resolve: {data: ['moResource', '$route', (moResource, $route) => {
            return {foo: moResource('/api/foo/:id/', {id: '@id'}).get({id: $route.current.params.id})};
        }]}
    });
}]);
```

In the `config` function for the section, register the routes you need and
their components. For the default `list` implementation, pass a resolved
`$resource` object directly (we wrap in Monad's `moResource` factory for
reasons we'll explain shortly). For the CRUD implementation, pass the
resource(s) this section can modify under the `data` key, again wrapped by
`moResource`.

## Registering a menu option
Wouldn't it be nice if your defined routes/components showed up in the main top
menu? Of course it would, but we're going to need to tell Monad about them. For
this we use the `moNavigation` service.

In a `run` section on the module, inject `moNavigation` and call its `option`
method to register a menu item:

```javascript
app.run(['moNavigation', function (moNavigation) => {
    moNavigation.option({
        title: 'Foo!',
        url: '/foo/'
    });
});
```

The default `index.html` template has one menu, and it's called `main`. This is
the default to add to, but you can specify a `menu` key with your own name if
you need to. If your admin is multilanguage, you'll also want to inject
`gettext` and run the title through it to mark it as translatable.

## Notifications
By "notifications" we mean the common practice of adding a little number next
to a menu item to alert the user that action is required. Monad offers a simple
interface to make this happen.

`moNavigation.option` accepts an optional `notify` key. It should contain a
function that returns an integer with the number of notifications. If the number
is zero, the notification won't show up; otherwise, it will alert the user.

How you determine that number is entirely up to you; an `$http` call, some
websocket event, calculate it from some `$resource`... Monad won't care.

> Caution: since `notify` is a function, it gets called often. Don't just
> blindly do an `$http.get` call - make sure to check if a call wasn't in
> progress already or you'll crash your browser. This is equivalent to how one
> would implement the custom `Authentication` - it too gets checked on a lot of
> digest cycles.

For example, you could do something like the following:

```javascript
//...
    nofity: function () {
        var counter = 0;
        var promise = undefined;
        if (!promise) {
            promise = $http.get('/some/api/url').success(function (alerts) {
                counter = alerts;
            });
        }
        return counter;
    }
//...
```

## Updating notifications
Inject `$rootScope` and emit/broadcast/listen to custom events where required
if you need to update notifications based on actions the user partakes in your
administrator. Or, you can be lazy and just set a `$timeout` inside the
notification function that runs every five seconds or so.

