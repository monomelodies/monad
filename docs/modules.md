# Modules
Monad works with the concept of 'modules', but in the ES6-sense, not the
Angular-sense. Each module in essence exposes two views: a data list and a
data form (for editing a single item). As an example, let's show how to make a
module where we manage our favourite programming languages.

> No controversy intended; these aren't necessarily _our_ favourite languages!

## Setup
First, create a folder somewhere that will contain all your module's files. This
isn't strictly required by Monad, but it makes your code more reusable since a
module's folder can be picked up and placed in another project easily.

    $ mkdir Proglang && cd Proglang

For easy importing, we'll also define a single entry point called `app.js`.
Again, this isn't strictly required but it prevents us from having to write a
bunch of `import` statements every time we want to use the module.

    // Proglang/app.js
    "use strict";


    import {Service} from './Service';
    import {Model} from './Model';
    // Change this to reflect your own path to Monad:
    import * as Module from '/path/to/monad/src/Module/app';

    angular.app('monad').config(['$routeProvider', function($routerProvider) {
        var module = 'proglang';
        $routeProvider.
            when('/proglang/', {
                controller: Module.ListController,
                controllerAs: 'list',
                templateUrl: 'monad/src/Module/list.html',
                resolve: {Service, Model, module}
            }).
            when('/proglang/:id/', {
                controller: Module.ItemController,
                controllerAs: 'item',
                templateUrl: 'monad/src/Module/item.html',
                resolve: {Service, Model, module}
            });
    }]);

    export {Service};
    export {Model};

A Monad module contains, at the very least a `Service` and a `Model`. The
service is predictably used by Angular to retrieve (lists of) items, whereas the
model is a representation of a single item with CRUD functionality. The model,
service and the module name are injected into their respective controllers, in
this example the default `ListController` and `ItemController` from Monad (more
on these later).

## Models
Now, let's start with defining our model:

    // Proglang/Model.js
    "use strict";

    import {Model as Base} from '/path/to/monad/src/Module/Model';

    class Model extends Base {
        
        $create() {
        }
        
        $update() {
        }
        
        $delete() {
        }

    };

    export {Model};

For now, we're merely setting up some skeletons. Later, we'll see how Monad uses
the existence or absence of methods to determine what functionality is offered
by a module.

> Lots of methods and other properties are prefixed with `$`, especially in
> models. This to a avoid naming clashes when we'll be adding getters and
> setters later on.

There are three interesting static properties we can set on a Model:

    Model.$list = [];
    Model.$widgets = {};
    Model.$fieldsets = [];

`$list` is an array of fields to expose in the list view (in this example,
imagine each programming language also has some sample code. We'd only want
that in the detail view, obviously).

`$widgets` is a key/value map of fieldnames and the widget to be used to edit
the data. Monad provides a bunch of defaults (e.g.
`'monad/src/Widget/text.html'` for a simple text input) and of course you can
define your own as long as the URL resolves.

`$fieldsets` in an array of hashmaps allowing you some quick and dirty control
over what gets displayed how. Below is an explanation:

    Model.$fieldsets = [
        {title: 'text.for.translation', fields: [], className: 'some-class'}
    ];

These speak for themselves; fields is an array of field names to be included
in this particular fieldset, and the `className` gets added to the HTML (since
Monad's HTML/CSS is Bootstrap-based, stuff like `col-md-4` is what you'll use
most often, but of course you are free to define your own wild classes).

## Services
Next up is our service, since Monad needs a generic interface to whatever API
you're using. For this example, let's assume we can make calls to
`/api/proglang/` (listing all languages) and `/api/proglang/:id/` (detailing
a single language).

    // Proglang/Service.js


