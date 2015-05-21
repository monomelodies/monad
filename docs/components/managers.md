A core concept in a Monad admin is the `Manager`. A "manager" is like a super
object handling all module-specific retreiving and storing of data. You can
think of it as an interface between Monad and whatever backend you're using.

ECMAScript lacks interfaces, but Monad assumes a manager adheres to the
following specifications:

    class Manager {
    
        list(...params) {
            // Returns array of Models
        }

        find(...params) {
            // Returns promise yielding Models found using params (usually
            // taken from $routeParams)
        }

        create(item) {
            // Create item (which is a Model), return promise.
        }

        update(item) {
            // Update existing item Model, return promise.
        }

        delete(item) {
            // Delete existing item Model, return promise.
        }

Which params you need to supply is dependant on your API and preferences. The
default Manager in Monad offers `list` and `find` methods that simply accept a
URL, call it using `$http.get` and transform the response using the `model`
property on the Manager (which itself defaults to the base Model).

So, the following is a common pattern:

    "use strict";

    import {Manager as Base} from '/path/to/monad/src/services/Manager';
    // Assuming we require a custom Model:
    import {Model} from './Model';

    class Manager extends Base {

        constructor(...args) {
            // Calling `super()` is required, even if the constructor doesn't do
            // anything. If we don't, other methods won't have access to
            // `super` either.
            super(...args);
            this.model = Model;
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

As you can see in `Manager.js`, it's a little more compicated than that since
you'll likely want to keep default transformations too (e.g. Monad's post
normaliser), but this is the basic idea.
