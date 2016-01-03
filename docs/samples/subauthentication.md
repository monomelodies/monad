# Sub-authentication
Besides the global `Authentication` service, each component can define one or
more sub-authentication services. This is done using the `authentication` method
on a component:

```javascript
class MyCustomService {
    // Implement interface for Authentication
}

monad.component('fizzbuzz')
    .authentication(MyCustomService);
```

## Access control
Templates requiring fine-grained access control handling should be wrapped in an
`mo-login` directive, specifying your custom authentication service. By default
this directive shows the login screen if the check fails; you can supply
additional `template` or `template-url` attributes to override this behaviour.

`template` is an expression evaluating to a string of HTML to show.
`template-url` is an expression evaluating to a URL to include instead (cfg.
`ng-include`).

The implementation of the Authentication service's `check` getter is up to you;
maybe it looks to the main session, maybe it does its own calls. Maybe it
flips a coin.

The custom service is passed a `pagetype.Authentication`, e.g.
`list.Authentication` when in the list view. So your templates should the be
wrapped in an additional `mo-login` directive:

```html
<!-- /some/module/list.html -->
<mo-login auth="list.Authentication" template-url="'/some/module/noaccess.html'">
    <mo-list>...</mo-list>
</mo-login>
```

The `noaccess.html` template in this example could then show a friendly (or not
so friendly :)) message explaining why the user is denied access even though
she's obviously logged in.

## Adding sub-authentication to a parts of a component
We saw above how you add sub-authentication to a specific component. This is
really setting the defaults for `list`, `create` and `update`; hence, for even
more fine-grained control you can set or override these manually:

```javascript
monad.component('fizzbuzz')
    .list('/fizzbuzz/', {}, {Authentication: CustomListAuthentication})
    .create('/fizzbuzz/create', {}, {Authentication: CustomCreateAuthentication})
    .update('/fizzbuzz/:id', {}, {Authentication: CustomUpdateAuthentication});
```

Of course, like other component properties the defaults are inherited. So, the
following will also work:

```javascript
monad.component('fizzbuzz')
    .authentication(MyCustomService);

// foo and bar component inherit fizzbuzz's custom authentication:
monad.component('foo')
    .extend('fizzbuzz');
monad.component('bar')
    .extend('fizzbuzz');
```

...and you could even override extended overrides:

```javascript
monad.component('fizzbuzz')
    .authentication(MyCustomService)
    .list('/fizzbuzz/', {}, {Authentication: ListsOnly});
monad.component('foo')
    .extend('fizzbuzz')
    .authentication(YetAnotherCustomClass)
    .list('/fizzbuzzfoo/', {}, {Authentication: GoWildWithAuthentication});
```

> Monad automatically registers the Authentication injection with Angular under
> a (hopefully) unique name: `component + '_' + type + 'Authentication'`. Since
> component names are unique and each "type" (list, update etc.) can only have
> one default authentication scheme, this should always work.

For complicated admins where you require additional authentication services, use
the following strategy:

Add a custom controller (possibly extending one of Monad's defaults):

```javascript
import ListController from 'monad/controllers/ListController';

class MyCustomController extends ListController {

    constructor(customAuth, ...args) {
        super(...args);
        // ...do something with customAuth here
    }

}

class CustomAuth {
}

monad.component('mycustomthing')
    .service('customAuth', customAuth)
    // etc.
    .list('/path/', {}, {customAuth: ['customAuth', customAuth => CustomAuth]});

MyCustomController.$inject = ['customAuth'].concat(ListController.$inject);
```

Note that in this case you _will_ of course have to manually register the
service with Angular.

