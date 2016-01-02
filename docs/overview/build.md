# Setting up a build script
Monad uses ES6-style modules, but of course most current browsers don't know
what to make of those. This means you have to _transpile_ your code. You're free
to write your whole admin in ES5 if that's your "thang", but you'll need
something like [Browserify](http://browserify.org/) and a transpiler to at least
import Monad once.

When you look at `index.html`, you'll notice that it attempts to load a
`bundle.js` from the current directory. This is where your admin code is loaded,
so it's up to you to make sure that file exists.

The simplest way is of course to just write all your code in `bundle.js` in
your admin-or-wherever directory, which works as a poor man's solution. But
since we need a transpiler in combination with Browserify anyway, you might as
well take advantage of ES6 features (they're awesome!) and split stuff into
multiple smaller files for maintainability.

Monad itself uses the [Babel transpiler](https://babeljs.io/). There are
alternatives, but all examples will assume Babel.

## Importing
At the top of your admin's entry point, `import` the Monad core:

```javascript
import monad from 'monad-cms';
```

This is equivalent to Node's `require()` call. It loads Monad and all libraries
Monad itself depends on (like AngularJS).

## Browserifying
You can transpile your admin manually:

```bash
$ npm install --save-dev babelify
$ browserify /path/to/entry/script.js -t babelify \
    --outfile /path/to/admin/bundle.js
```

## Grunt build script
```bash
$ npm install --save-dev grunt-browserify grunt-contrib-copy babelify \
    babel-polyfill babel-preset-es2015
```

> As of Babel 6, the actual transpiling is done by plugins.
> `babel-preset-es2015` contains all common ES6 transpilations you'll likely
> need, but of course YMMV.

In your project's `package.json`, add the following to the root:

```json
{
    // ...other stuff...
    "babel": {
        "presets": [
            "es2015"
        ]
    }
}
```

Next create a file called `Gruntfile.js` in the project's root:

```javascript
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.initConfig({
        browserify: {
            admin: {
                src: 'src/admin/my-admin-entry.js',
                dest: 'path/to/admin/bundle.js',
                options: {
                    transform: ['babelify'],
                    watch: true
                }
            }
        },
        copy: {
            admin: {
                files: [
                    {expand: true, src: '**/*.{html,json}', cwd: 'src/admin', dest: 'path/to/public/admin/'}
                ]
            }
        }
    });
};
```

Feel free to add stuff like `uglify`, sourcemaps etc. at will, as long as you
eventually output to `admin/bundle.js`.

You'll probably also want to expose certain assets from your `./src` folder so
Monad can access them (see the `copy` task above).

> Of course, you could also use symlinks for that; it depends on your preference
> and whether or not your host allows you to do that.

Grunt is a _very_ extensive tool and we won't go into details here. Some plugins
you might want to check out are `load-grunt-config` and `load-grunt-tasks`.

## Gulp build script
First, `npm install` the [Gulp](http://gulpjs.com/) modules you need. The
example below is probably slightly outdated since the newest Babel version
introduced a *lot* of breaking changes, but it can serve as a starting point:

```javascript
var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('admin', function() {
    browserify({
        entries: './httpdocs/admin/your-entry-point.js',
        debug: true
    }).
    transform(babelify).
    bundle().
    pipe(source('bundle.js')).
    pipe(buffer()).
    pipe(gulp.dest('./httpdocs/admin'));
});
```

For exposing static assets, use something like `gulp-copy`.

## Other tools
There's many other tools for building stuff; you're free to use one of your own
liking or even cobble something custom together yourself. As long as the output
goes to `admin/bundle.js`, we're all fine with that.

