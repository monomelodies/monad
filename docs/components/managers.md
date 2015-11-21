# Managers
A core concept in a Monad admin is the `Manager`. A "manager" is like a super
object handling all module-specific retreiving and storing of data. You can
think of it as an interface between Monad and whatever backend you're using.

ECMAScript lacks *actual* interfaces, but Monad assumes a manager adheres to the
following specifications:

```javascript
class Manager {

    get count() {
        // Returns the total number of entries of this type
        // (used for pagination)
    }

    list(...params) {
        // Returns a Collection of Models. Note that this is also responsible
        // for pagination. The Collection should have a `$then` property which
        // proxies to the underlying promise used to retrieve the data (if any).
    }

    paginate(page, params) {
        // Return call to list with the correct page injected.
        // Second argument contains the $routeParams, in case you need them.
    }

    find(...params) {
        // Returns a Model found using params (usually taken from $routeParams).
        // The Model should have a `$then` property which proxies to the
        // underlying promise used to retrieve the data (if any).
    }

    create(item) {
        // Create item (which is a Model), return promise.
    }

    update(item) {
        // Update existing item Model, return promise.
    }

    ['delete'](item) {
        // Delete existing item Model, return promise.
    }

}
```

Which `params` you need to supply is dependant on your API and preferences.

## Extending the default
The default Manager in Monad offers `list` and `find` methods that simply accept
a URL, call it using `$http.get` and transform the response using the `model`
property on the Manager (which itself defaults to the base `Model`).

So, the following is a common pattern:

```javascript
"use strict";

import Base from '/path/to/monad/src/services/Manager';
// Assuming we require a custom Model:
import Model from './Model';

class Manager extends Base {

    constructor(...args) {
        // Calling `super()` is required, even if the constructor doesn't do
        // anything. If we don't, other methods won't have access to
        // `super` either.
        super(...args);
    }

    list(param1, param2, param3) {
        // However you build your url...
        let url = `/some/${param1}/path/${param2}/with/${param3}/params/`;
        return super.list(url);
    }

    find(param4) {
        // Again, whatever...
        let url = `/somewhere/${param4}/else/`;
        return super.find(url);
    }

    // Implement create, update, delete as required.

}

// This is for the custom model:
Manager.Model = Model;
```

Note that you can just as well write a manager using differently named methods;
but you'll also need to roll your own controller in that case. Alternatively,
there's nothing that requires you to call the `super` methods; you can write
your own implementation, as long as Models or Collections of Models are returned
(or your custom controller does not expect those, that's also fine of course).

## Manually transforming the `$http` response
This is really something Angular-y, so outside of the scope of this
documentation. But, take a peek in `./services/Manager.js` to see how Monad
handles it internally. In short, it boils down to the following. Instead of
`this.http.get` or `this.http.post`, you call `this.http` as a function for
low-level control:

    // ...import as before...

    class Manager extends Base {
    
        // ...
        someMethod() {
            this.http({
                url: '/path/to/server/',
                method: 'GET', // Or POST or whatever...
                // other options...
                transformResponse: [values => {
                    // return transformed values
                }]
            });
        }

    }

As you can see in `Manager.js`, it's a little more complicated than that since
you'll likely want to keep default transformations too (e.g. Monad's post
normaliser), but this is the basic idea.

> Usually, you can just call the `super` versions with a prepared URL and be
> done with it; overriding those are a _very_ specific use-case.

