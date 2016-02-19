# Authentication
Since Monad is a client-side framework, we'll need some way of authenticating a
user to see if she has access to our admin. We don't make any assumptions
regarding your authentication scheme, so this is something you'll *have* to
configure and implement yourself.

## The `mo-login` component
Sections requiring an access check should be wrapped in the `mo-login`
component. Its default behaviour is to show the transcluded content if access
is granted, and otherwise show its own template (which should contain something
useful, like a login form or a notification).

`mo-login` requires a scope parameter called `auth`. This is normally the
Authentication object for your current component. The `monad` root controller
also exposes `monad.Authentication` which is the main auth service, and wraps
your entire admin in a login directive as well.

The default behaviour is to show a form with `username` and `password` fields.
If your admin requires a different authentication method (e.g. two tier using
text messages), you should override the `mo-login` directive and/or template.

Since Monad prebundles all its templates using `$templateCache`, overwriting the
key `/monad/templates/login.html` should do the trick. The actual handling is
done by your `Authentication` service anyway (see below).

## Interface
Monad expects the required service to be registered in Angular as
`Authentication`. So, let's set up our own implementation. The
service needs to implement the following interface:

```javascript
export default class AuthenticationService {

    ['status']() {
        // Return a promise reading the current authentication status.
    }
    
    attempt(credentials) {
        // Returns a promise attempting authentication using supplied
        // `credentials` (a key/value hash). What `credentials` you pass depends
        // on your application's needs - a common scenario is of course
        // `username` and `password`, but if you also require `mobile_number`,
        // `social_security` and `mothers_maiden_name` that's all fine too.
    }
    
    revoke() {
        // Returns a promise attempting to revoke the current authentication
        // status (i.e., "logout").
    }
    
    check() {
        // Return true if the user is authenticated according to the
        // current session, false otherwise. If your login scheme involves
        // stuff like roles, this should check for the correct ones
        // accordingly.
    }

}
```

Import this in your entry point file (or simply define it there, whichever you
prefer) and override it in Angular:

```javascript
import AuthenticationService from '/path/to/AuthenticationService';
monad.application('foobar')
    .service('Authentication', AuthenticationService);
```

> Note that this is the global authentication for your entire application, as
> referenced by the `RootController`.

## Example
Usually you'll inject Angular's `$http` service to make the required calls. A
very basic real-world implementation could look like this:

```javascript
let session = undefined;

export default class AuthenticationService {

    constructor($http) {
        this.http = $http;
    }
    
    ['status']() {
        return this.http.get('/session/').then(result => {
            session = result.data;
        });
    }
    
    attempt(credentials) {
        let action = 'login';
        let {username, password} = credentials;
        return this.http.post('/session/', {action, username, password}).then(result => {
            session = result.data;
        });
    }
    
    revoke() {
        let action = 'logout';
        return this.http.post('/session/', {action}).then(result => {
            session = result.data;
        });
    }
    
    check() {
        return session && 'User' in session && session.User == 'admin';
    }

}

AuthenticationService.$inject = ['$http'];
```

Obviously, you'll need to write server side code to actually handle the calls to
the `/session/*` endpoints. In more complicated admin environments you'll
probably also want to implement something like user roles or access control
lists. This is all outside the scope of this tutorial.

Monad's built-in `moLoginController` will call these methods, and as long as
your implementation honours the required interface authentication will work!

> The global `Authentication` service handles only basic access to your admin;
> for examples of more complex handling of multiple "sub-APIs" see 
> [the corresponding section in this manual](../samples/subauthentication.md).

