# Setup
We saw earlier how Monad works with the concept of 'modules', both in the
ES6-sense as well as the Angular-sense. Let's dive into that a bit further.
You can think of a module as 'an option that shows up in the (main) menu',
although technically it is not required to actually expose modules in any menu.

> To differentiate between AngularJS and ES6 modules, Monad refers to them as
> "components" instead.

First, create a folder somewhere that will contain all your module's files. This
isn't strictly required by Monad, but it makes your code more reusable since a
module's folder can be picked up and placed in another project easily.

So, for our fictional module `Foo` we make a folder `foo` under `admin`
to place all our files in. By convention, we create an entry point called
`angular.js` here which hooks everything up to our Angular module:

```javascript
// foobar/angular.js
"use strict";

monad.module('foobar', 'foo')
    // <- define custom stuff here
    ;
```

Note that we're still naming our application `foobar`. The 'custom stuff' will
generally consist of one or more of the following:

```javascript
monad.module('foobar', 'foo')
    // Manager class, available as `foobarFooManager` in Angular:
    .manager(Manager)
    // API URL to show a list of items:
    .list('/my/url/', {
        // Omit or set to true (default) to have this show up in the main
        // top menu. The text ID used is `monad.navigation.COMPONENT`, or
        // `monad.navigation.foo` in this example:
        menu: false,
        // Array of column names to include in the list:
        columns: ['col1', 'col2']
    })
    // API URL to create or update an item. `:id` contains whatever your
    // unique identifier is (if that's two columns, you'll need to handle
    // it seperately). For creating, `:id` is replaced with the word
    // `:create`.
    .update('/my/url/:id/')
    ;
```

