Since Monad is a client-side framework, we'll need some way of authenticating a
user to see if she has access to our admin. We don't make any assumptions
regarding your authentication scheme, so this is something you'll *have* to
configure and implement yourself.

Monad expects the required service to be registered in Angular as
`moAuthentication`. So, let's set up our own implementation. The
service needs to implement the following interface:

    class AuthenticationService {

        read() {
            // Return a promise reading the current session.
        }
        
        login(username, password) {
            // Return a promise attempting a login. By default Monad uses
            // username/password-based login. If you require something else,
            // you'll have to further customize the Authentication module.
        }
        
        logout() {
            // Return a promise attempting a logout.
        }
        
        isAuthenticated() {
            // Return true if the user is authenticated according to the
            // current session, false otherwise. If you login scheme involves
            // stuff like roles, this should check for the correct ones
            // accordingly.
        }
    
    }

Import this in your entry point file (or simply define it there, whichever you
prefer) and override it in Angular:

    angular.module('monad', [Monad])
           .service('moAuthentication', AuthenticationService);

Usually you'll inject Angular's `$http` service to make the required calls. A
very basic real-world implementation could look like this:

    class AuthenticationService {

        constructor($http) {
            this.http = $http;
            this._session = undefined;
        }
        
        read() {
            return this.http.get('/session/').success(result => {
                this._session = result;
            });
        }
        
        login(username, password) {
            let action = 'login';
            return this.http.post('/session/', {action, username, password});
        }
        
        logout() {
            let action = 'logout';
            return this.http.post('/session/', {action});
        }
        
        isAuthenticated() {
            return this._session && 'User' in this._session && this._session.User == 'admin';
        }
    
    }
    
    AuthenticationService.$inject = ['$http'];

Obviously, you'll need to write server side code to actually handle the calls to
the `/session/*` endpoints. In more complicated admin environments you'll
probably also want to implement something like user roles or access control
lists. This is all outside the scope of this tutorial.

Monad's built-in `moLoginController` will call these methods, and as long as
your implementation honours the required interface authentication will work!
