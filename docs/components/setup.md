# Setup
We saw earlier how Monad works with the concept of 'modules', both in the
ES6-sense as well as the Angular-sense. Let's dive into that a bit further.
You can think of a module as 'an option that shows up in the (main) menu',
although technically it is not required to actually expose modules in any menu.

> To differentiate between AngularJS and ES6 modules, Monad refers to them as
> "components" instead.

## Create a component
First, create a folder somewhere that will contain all your module's files. This
isn't strictly required by Monad, but it makes your code more reusable since a
module's folder can be picked up and placed in another project easily.
Additionally, some assumptions are made by default (e.g. views live under
`path/to/component`) so to minimize hassle it's best to keep stuff grouped.

So, for our fictional module `Foo` we make a folder `foo` under `admin`
to place all our files in. By convention, we create an entry point called
`angular.js` here which hooks everything up to our Angular module:

```javascript
// foobar/foo/angular.js
"use strict";

export default monad.component('foo')
    // <- define custom stuff here
    ;
```

## Define actions
The 'custom stuff' will generally consist of one or more of the following:

```javascript
export default monad.component('foo')
    // Manager class, available as `foobarFooManager` in Angular:
    .manager(Manager)
    // API URL to show a list of items:
    .list('/my/url/')
    // API URL to create a new item. If everything else is identical to
    // updating, you can also specify this as `{create: '/my/url/create'}` as
    // a second option to `update`.
    .create('/my/url/create/')
    // API URL to update an item. `:id` contains whatever your
    // unique identifier is (if that's two columns, you'll need to handle
    // it seperately).
    .update('/my/url/:id/')
    ;
```

By default, a `list` action will call `list` on the registered Manager.
Likewise, an `update` action will call `find` (in the above example, that would
be a `fooManager` as far as Angular is concerned).

## Expose the component in a menu
For our component to show up in a menu, we need to tell the _application_ that
should happen:

```javascript

import foo from '/path/to/foo';

monad.application('foobar', [])
    .navigation([foo]);
```

The second optional argument to `navigation` can be a menu name, which defaults
to `main` (the top menu in the default skin). Custom skins or views can define
as many menus as they like.

## Customising the title
The default label in the menu is simply the component's name; not very user
friendly. Luckily, we can easily customise it by adding a simple `menu.html`
snippet to our module:

```html
<!-- foo/menu.html -->
Show me foo!
```

In the next chapter we'll go about implementing our actual Manager.

