# Collection
An array-like collection class, providing additional functionality for use with
models.

## Usage
```javascript
"use strict";

import {Collection} from '/path/to/monad/src/classes/Collection';

class CustomCollection extends Collection {

    constructor(...args) {
        super();
        // do your custom stuff here
    }

    defaults(obj) {
        // augment obj (a model or plain object hash of new data) with
        // defaults needed on this Collection.
        return obj;
    }

};
```

The Collection object is meant to provide additional functionality for lists of
Models. This mostly comes in handy when dealing with models linked by foreign
keys.

## Example
Consider the following scenario: we have a component `foo`. However, a `foo`
model contains zero or more `bar` models which are linked through some foreign
key in some data source. The Manager for `bar` will justly return a list of
models and that will work nicely, but as soon as we want to add a `bar` model
to the list we're in trouble: it doesn't have the foreign key yet (let's say
it's called `fooId`).

This is however trivially handled using a custom Collection:

```javascript
"use strict";

import {Collection} from '/path/to/monad/src/classes/Collection';

class BarCollection extends Collection {

    constructor(fooId, ...args) {
        super();
        this.fooId = fooId;
        // Optionally, set this.model to a custom model class if you require
        // one for a 'bar'. The collection automatically calls $load or $create
        // where required.
    }

    defaults(obj) {
        obj.fooId = this.fooId;
        return obj;
    }

};
```

Each new `bar` model will now automatically receive the correct `fooId` for this
item.

Then, tell your `foo` component configuration to load `bar`s using the
collection:

```javascript

import {BarCollection} from '/path/to/BarCollection';

// Other configration as normal...
monad.component('foobar', 'foo', ['bar'])
    // manager, list and other calls...
    .update('/path/to/update/:id', {}, {
        bars: ['foobarBarManager', '$route', (manager, $route) => {
            return manager.list($route.params.current.id).then(result => {
                let collection = new BarCollection($route.params.current.id);
                result.data.map(item => collection.push(item));
                return collection;
            });
        }]
    });
```

## API

- ####defaults####

    Overridable helper method that set defaults for each item in a Collection.
    Returns the augmented object.

- ####$dirty####

    Like `Model.$dirty`, only returns true if any item in the collection is
    either `$new`, `$dirty` or `$deleted`. This provides a quick check to skip
    managing an entire collection if nothing changed.

A Collection also transparently proxies most `Array` methods, but ensures items
are an instance of the specified model.

