# Authentication
A stub service describing the interface for authentication. Your own
authentication service must override this as `moAuthentication`. See
the section on [authentication](../overview/authentication.md).

The interface is defined as follows:

```javascript
class Authentication {

    ['status']() {
        // Return promise reading current session.
    }
    
    attempt(...credentials) {
        // Return promise attempting login with provided credentials.
    }

    missing() {
        // Do what is needed to alert user or elevate permissions.
    }
    
    revoke() {
        // Return promise attempting logout from current session.
    }
    
    get check() {
        // Return true if authenticated, else false.
    }   
    
};
```

