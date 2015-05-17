Monad comes with an `index.html` file that is a good skeleton for your admin
application. Of course, you could write your own, but for defaults it's usually
fine to use the supplied one.

    $ cd /path/to/admin
    $ ln -s /path/to/monad/index.html .

If you open `index.html` in your favourite editor, you'll notice it defines a
`<base/>` tag. This uses the Angular value `monad.paths.root`. `monad` is the
alias of the root `moController`, so usually this is at least one controller
you'll want to override and customize:

    // /entrypoint.js
    "use strict";

    import {Monad} from '/path/to/monad/angular';
    import {RootController} from '/path/to/monad/src/controllers/RootController';
    
    class Controller extends RootController {

        constructor(...args) {
            super(...args);
            this.title = 'My awesome FooBar admin';
            this.paths.root = '/admin/';
        }

    }

    angular.module('monad', [Monad]).controller('moController', Controller);

We've also overridden the title (this is cosmetic), but more importantly told
Monad our admin will live under the URL `/admin/`. All other paths used are now
relative to that base, so it is usually the easiest to just install Monad in
that directory directly (or work some magic with Apache aliases or another proxy
mechanism, but that's outside the scope of this manual).
