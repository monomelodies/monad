Code is best explained by examples, so let's get our hands dirty and setup a
Monad plugin for the popular Wordpress blog system.

> This section is a bit of work in progress still.

## Prerequisite: WP REST API
This is a popular but far-from-perfect plugin that exposes the WP database
through a common API. We could bitch about it for hours, but it's the de facto
standard so we're going to use it. You can find the plugin here:
`https://wordpress.org/plugins/json-rest-api/`. Install it in your Wordpress
site via the normal plugin system.

For this tutorial, we'll assume the API is available under `/wp/`. Similarly,
we'll put our admin stuff in `/admin/wp/` with an entry point
`/admin/wp/angular.js`. We'll also focus on managing _posts_. (By the time we've
finished, building managers for categories, comments etc. should be obvious to
you.)

## Entry points
We'll fill in the details later:

    // /admin/wp/post/angular.js
    "use strict";

    import {Manager} from './Manager';

    monad.component('myapp', 'post')
        .manager(Manager);

    export default 'post';

Also, a main Wordpress entry point with a dependency on the `post` module:

    // /admin/wp/angular.js
    "use strict";

    import {default as post} from './post/angular';
    
    monad.component('myapp', 'wp', [post]);

    export default 'wp';

And a generic entry point for the entire administrator:

    // /admin/tutorial.js
    "use strict";

    import {default as wp} from './wp/angular';

    monad.application('myapp', [wp])
        // other stuff
        ;

## Authentication
Wordpress has its own authentication system, so we need to tell Monad how to
work with that.

## Manager
    // /admin/wp/post/manager.js
    "use strict";

    import {Manager as Base} from '/path/to/monad/src/services/Manager';

    class Manager extends Base {

        constructor(...args) {
            super(...args);
        }

        list(params = {}) {
            return super.list('/wp/posts?paged=' + (params.page || 1));
        }

        find(params = {}) {
            return super.find('/wp/posts/' + params.id);
        }

    }

    export {Manager};

