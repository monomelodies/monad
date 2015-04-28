Since Monad is a client-side framework, we'll need some way of authenticating a
user to see if she has access to our admin. We don't make any assumptions
regarding your authentication scheme, so this is something you'll *have* to
configure and implement yourself.

Monad expects the required service to be registered in Angular as
`monad.Authentication.Service`. So, let's set up our own implementation. The
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

    angular.module('monad', [Core])
           .service('Authentication.Service', AuthenticationService);

Usually you'll inject Angular's `$http` service and use that for authentication.
Now, you can try and log in!
