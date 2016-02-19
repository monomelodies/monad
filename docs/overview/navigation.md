# Navigation
Wouldn't it be nice if your defined routes/components showed up in the main top
menu? Of course it would, but we're going to need to tell Monad about them. For
this we use the `moNavigation` service.

## Registering a menu option
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
`gettextCatalog` and run the title through its `getString` method.

## Notifications
By "notifications" we mean the common practice of adding a little number next
to a menu item to alert the editor that action is required. Monad offers a
simple interface to make this happen.

`moNavigation.option` accepts an optional `notify` key. It should contain a
function that returns an integer with the number of notifications. If the number
is zero, the notification won't show up; otherwise, it will alert the user.

How you determine that number is entirely up to you; an `$http` call, some
websocket event, calculate it from some `$resource`... Monad won't care.

> Caution: since `notify` is a function, it gets called often. Don't just
> blindly do an `$http.get` call - make sure to check if a call wasn't in
> progress already or you'll crash your browser.

## Updating notifications
Inject `$rootScope` and emit/broadcast/listen to custom events where required
if you need to update notifications based on actions the user partakes in your
administrator. Or, you can be lazy and just set a `$timeout` inside the
notification function that runs every five seconds or so.

