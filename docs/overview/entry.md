Your admin application will need an entry point. This is the main script that
Browserify will use to bundle all modules from.

    $ cd /path/to/your/project
    $ mkdir admin

    > Note: generally you should place source code in a separate directory (e.g.
    > `./src`)  to differentiate from other directories  like `./vendor`,
    > `./node_packages`, `./httpdocs`, `./tests` etc.

At the most basic level, your entry point should contain the following:

    // ./admin/myproject.js

    // Not required, but generally a good idea.
    "use strict";

    // Import core Monad module:
    import {default as Core} from './path/to/monad/src/Core/app'

    angular.module('monad', [Core]);

By convention, the _Angular_ module name is `monad`. This is the name used for
`ng-app` in the default `index.html` (`monad/src/index.html`). It's up to you
to make the necessary changes if you need to or want to use a custom module
name. The main admin module _must_ have a dependency on the `Core` app.

The default export for 'app' style entry points is an AngularJS module name.
The exact name is essentially a random-but-unique string. Monad itself uses
`monad.Modulename`-style naming.

Now, setup your build process (e.g. Gulp) to transpile and browserify your
entry point (`./admin/myproject.js`) and write it to something publicly
accessible under the name `bundle.js`. In our examples we'll assume we want our
admin to live under `admin` (e.g. `./httpdocs/admin`).

An example Gulp task could look like this:

    // Make sure these are all installed via `npm install`:
    var babel = require('gulp-babel');
    var browserify = require('browserify');
    var transform = require('vinyl-transform');
    var uglify = require('gulp-uglify');
    var babelify = require('babelify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');

    gulp.task('bundle-admin', function() {
        // 1. Browserify our entry point
        browserify({
            entries: './src/admin/myproject.js',
            debug: true
        }).
        // 2. Babelify (transpile) and bundle. Other transpilers (e.g. Traceur)
        // will use a similar syntax.
        transform(babelify).
        bundle().
        // 3. Pipe the transpiled javascript to `bundle.js`.
        pipe(source('bundle.js')).
        pipe(buffer()).
        // 4. Optionally uglify the result (might be impractical during
        // debugging, although transpiled code isn't extremely debuggable to
        // begin with).
        pipe(uglify()).
        // 5. Write to a public place.
        pipe(gulp.dest('./httpdocs/admin'));
    });

You'll probably also want a Gulp watch to automatically rebuild this whenever
any of the files change.

That's it! Run the task, navigate to `http://your.project/admin/` and you can
start filling in the details.
