Code is best explained by examples, so let's get our hands dirty and setup a
Monad plugin for the popular Wordpress blog system.

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

    import {Module} from '../../monad/src/Module';

    export default Module('wp/post', [], {
    });

Also, a main Wordpress entry point with a dependency on the `wp/post` module:

    // /admin/wp/angular.js
    "use strict";

    import {Module} from '../monad/src/Module';
    import {default as post} from './post/angular';

    export default Module('wp', [post], {
    });

And a generic entry point for the entire administrator:

    // /admin/tutorial.js
    "use strict";

    import {Monad} from './monad/src/angular';
    import {default as wp} from './wp/angular';

    angular.module('monad', [Monad, wp]);

## Authentication
Wordpress has its own authentication system, so we need to tell Monad how to
work with that.

## Manager
    // /admin/wp/post/manager.js
    "use strict";

    let http;

    class Manager {

        constructor($http) {
            http = $http;
        }

        list(params = {}) {
            return http.get('/wp/posts?paged=' + (params.page || 1));
        }

        find(params = {}) {
            return http.get('/wp/posts/' + params.id);
        }

    }

    Manager.$inject = ['$http'];

    export {Manager};

