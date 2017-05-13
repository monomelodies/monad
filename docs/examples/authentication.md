# Authentication example
This is an actual complete implementation of a working custom authentication
service, taken from an (anonymised) actual project.

## ES6
These days we write our JS in ES6 and transpile it using Babel. The service
would look like this, with some added comments:

```js
"use strict";

let http = undefined;
let route = undefined;
let session = undefined;

export default class Authentication {

    constructor($http, $route) {
        http = $http;
        route = $route;
    }
    
    ['status']() {
        // 'status' gets called on $routeChangeStart, so no
        // need to check if a call was in progress.
        return http.get('/api/session/').then(result => {
            // On resolve, store the data in a local private variable.
            session = result.data;
        });
    }
    
    attempt(credentials) {
        // This API happens to expect an "action" parameter.
        let action = 'login';
        // It also uses username/password to authenticate.
        let {username, password} = credentials;
        return http.post('/api/session/', {action, username, password}).then(result => {
            // Overwrite the private session data with the new status.
            session = result.data;
            // Reset all route data. This reloads resources that were previously
            // (un)available due to the old authentication status.
            route.reset();
        });
    }
    
    revoke() {
        // A bit like login. We don't need to reload the route here; it
        // wouldn't make much of a difference.
        let action = 'logout';
        return http.post('/api/session/', {action}).then(result => {
            session = result.data;
        });
    }
    
    get check() {
        // In this case, users with access will have a status.admin property
        // in their session data - of course YMMV.
        return session && 'status' in session && session.status.admin;
    }

}

Authentication.$inject = ['$http', '$route'];

// ...
// Assuming 'app' contains your Angular module:
app.service('Authentication', Authentication);

```

## ES5
In plain ol' ES5, the same service would look something like this:

```js
"use strict";

app.service('Authentication', ['$http', '$route', function ($http, $route) {
    var session = undefined;
    this['status'] = function () {
        return $http.get('/api/session/').then(function (result) {
            session = result.data;
        });
    }
    
    this.attempt = function (credentials) {
        var action = 'login';
        var username = credentials.username;
        var password = credentials.password;
        return $http.post('/api/session/', {action: action, username: username, password: password}).then(function (result) {
            session = result.data;
            $route.reset();
        });
    };
    
    this.revoke = function() {
        var action = 'logout';
        return $http.post('/api/session/', {action: action}).then(function (result) {
            session = result.data;
        });
    }
    
    Object.defineProperty(this, 'check' {get: function () {get check() {
        return session && 'status' in session && session.status.admin; 
    }
}]);
```

> *Important:* when implemented as a virtual property (like the above example),
> be aware that `check()` will get called on every Angular digest, so that
> means *often*. *Do not* make actual Ajax requests _inside_ it, but use a
> cached variable. Use the `status` method for data retrieval and store it
> somewhere (property, weakmap, whatever).

