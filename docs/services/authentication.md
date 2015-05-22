# Authentication
A stub service describing the interface for authentication. Your own
authentication service must override this as `moAuthentication`. See
the section on [authentication](../overview/authentication.md).

The interface is defined as follows:

```javascript
class Authentication {

    read() {
        // Return promise reading current session.
    }
    
    login(username, password) {
        // Return promise attempting login with provided credentials.
    }
    
    logout() {
        // Return promise attempting logout from current session.
    }
    
    isAuthenticated() {
        // Return true if authenticated, else false.
    }   
    
};
```

