# Sub-authentication
Besides the global `Authentication` service, each component can define one or
more sub-authentication services. This is done using the `authantication` method
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
        if (!Authentication.check()) {
            Authentication.missing();
        }
        // Other stuff...
    }

}

MyCustomController.$inject = ['Authentication'];
```


