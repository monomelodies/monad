# Sub-authentication
Besides the global `Authentication` service, each component can define one or
more sub-authentication services. This is done by setting the `authentication`
property on the `moNavigation.option` option object with a resolved custom
service:

```javascript
app.run(['moNavigation', 'myCustomAuthentication', function (moNaviation, myCustomAuthentication) {
    moNavigation.option({
        //... other options
        authentication: myCustomAuthentication
    });
}]);
```

Two things will happen now:

1. If the user logged in fails the custom authentication, the menu item simply
   won't show up in the specified menu.
2. If the user should manually navigate to the forbidden URL, she'll be
   redirected to the admin's home page.

## Making sections read-only for certain users
This is a question of injecting your custom authentication in the CRUD view, and
wrapping it in your own `ng-if`:

```html
<div ng-if="$ctrl.auth.check">
    ...editable fields...
</div>
<div ng-if="!$ctrl.auth.check">
    <uib-alert type="warning">In read-only mode!</uib-alert>
    ...interpolate read-only data...
</div>
```

As always, make sure your API _also_ checks permissions in case naughty users
try to manually call endpoints they're not allowed access to.

