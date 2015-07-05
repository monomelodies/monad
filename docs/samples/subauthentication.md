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
Each controller requiring a form of authentication should check user access on
construction. If you're extending Monad's default controllers, you're covered
already. If you need to do it manually, this is the way:

```javascript
class MyCustomController {

    constructor(Authentication) {
        if (!Authentication.check) {
            Authentication.missing();
        }
        // Other stuff...
    }

}

MyCustomController.$inject = ['Authentication'];
```

The implementation of `check` and `missing()` is up to you; maybe they look to
the main session, maybe they do their own calls. Maybe they flip a coin.

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

> theoretical situation where you'd 
