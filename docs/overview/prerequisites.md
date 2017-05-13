# Prerequisites
By now, we assume you've followed the steps in [overview](../index.md) and have
a very basic admin running under (for the sake of this tutorial) `/admin/`. If
you haven't, go there and do that first.

## REST API
Another important thing your application will need is an *API*. Exactly how that
should work is outside the scope of this tutorial; Monad is a client side
framework and by design doesn't care about your server.

Monad is built upon the premise that most applications will offer a REST API of
some sort. E.g. if you use the popular Worpress system (we personally don't like
it, but hey - it's popular) you'll be able to install the Wordpress API plugin
to expose your data.

In brief (and as a gross oversimplification) you can think of the API as a
bridge between your browser and your application's database, where `GET`,
`POST` and `DELETE` HTTP Ajax calls represent `SELECT`, `INSERT/UPDATE` and
`DELETE` operations respectively. APIs often follow this abstract pattern:

```
GET/POST/DELETE /some/base/url/{TABLE-OR-MODEL}/{OPTIONAL-ID} data:field=value
```

A "proper" API will do more than `SELECT * FROM {TABLE}`, e.g. when getting a
"post" from the Wordpress API you'll also retrieve related images etc. But this
is implementation-specific.

### Quick and dirty for PHP users
If your site's built on PHP but doesn't use some framework already supplying an
API out of the box, you might want to check out our [Monki API
bootstrapper](https://packagist.org/packages/monomelodies/monki). It's a
Composer package to easily expose (parts of) your application's database via a
simple "default API", including access control. It should at least get you up
and running quickly, and for admin purposes usually offers enough functionality
(if you're building a public facing API as well, you'll probably need to
manually write out all the calls anyway).

## Authentication
Since Monad is a client-side framework, we'll need some way of authenticating a
user to see if she has access to our admin. We don't make any assumptions
regarding your authentication scheme, so this is something you'll *have* to
configure and implement yourself. Even Monki won't do it for you...

### The `monadLogin` component
> This component was previously called `moLogin`. The old name is still
> supported via an alias, but is deprecated and will be removed in a future
> version of Monad.

Sections requiring an access check should be wrapped in the `<monad-login>`
component. Its default behaviour is to show the transcluded content if access
is granted, and otherwise show its own template (which should contain something
useful, like a login form or a notification).

`monadLogin` optionally takes an `auth` parameter. If undefined it defaults to a
service called `Authentication`. You will need to write this since Monad cannot
know how you determine if a user has enough access rights.

> Important: Your API should of course do its own authentication checks and not
> solely rely on the client side hiding stuff from users.

The default behaviour when unauthenticated is to show a form with `username` and
`password` fields. If your admin requires a different authentication method
(e.g. two tier using text messages), you should override the template. Since all
Monad templates are baked into the Javascript this is very simple:

```js
angular.module('myModuleName').run(['$templateCache', $templateCache => {
    $templateCache.put('Monad/components/Login/template.html', `
<div ng-transclude ng-if="$ctrl.check"></div>
<!-- your custom login form here -->`);
}]);
```

The only important thing is to remember to include the `ngTransclude` directive.
If you omit it, authenticated user won't see anything.

### Interface
Monad expects at least a required service to be registered in Angular as
`Authentication`. So, let's set up our own implementation. The
service needs to implement the following "interface":

> Javascript doesn't support interfaces, so this is more of a reference example
> providing dummy methods. You _must_ override this! Monad's source is in ES6,
> but this is transpiled to ES5 using Babel anyway so you're free to write all
> your own code directly in "old skool" ES5.

```js
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
    
    get check() {
        // Return true if the user is authenticated according to the
        // current session, false otherwise. If your login scheme involves
        // stuff like roles, this should check for the correct ones
        // accordingly.
    }
    
}
```

If you're writing in ES6 yourself, it's a good idea to _import_ and _extend_
this default implementation, so you'll quickly notice when you forget to define
and methods. In any case, register your custom implementation as a service on
your admin's main module:

```js

import Authentication from 'monad-cms/services/Authentication';

class myAuthentication extends Authentication {
\   // Your custom implementation
};

angular.module('awesome', ['monad-cms'])
    .service('Authentication', myAuthentication);
```

Note that this is now the global authentication for your entire application.
In other words, if you need to support "roles" or such, you would need
multiple authentication services, e.g. `AuthenticateAuthor`,
`AuthenticateCommenter` etc. Each authentication service can be injected into
a `monadLogin` directive via the `auth` attribute like so:

```html
<!-- Assuming customAuthentcation was placed on the $rootScope: -->
<monad-login auth="$root.customAuthentication"></monad-login>
```

Of course, authentication services can (and maybe should) in turn also inherit
from the base authentication service - the assumption being you'll usually only
need to override the `check` getter.

Generally you'll inject Angular's `$http` service to somehow talk to your
backend, e.g. `GET /api/session`. But you could also use other schemes, e.g.
websockets or authentication via a browser plugin. Anything is possible as long
as you can express it in Javascript!

> Again (since we can't stress this enough): _never_ solely rely on client side
> authentication and make sure your API double-checks permissions server side as
> well!

An example custom implementation can be found in the [advanced
section](../advanced/authentication.md).

