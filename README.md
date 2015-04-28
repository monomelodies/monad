# Monad
Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

## Installation
1. Put the Monad source inside the public folder you want to use to access your
   admin, e.g. `./httpdocs/admin`.
  - Monad would now live in `./httpdocs/admin/monad`.
  - Alternatively, install using e.g. Bower and symlink the `monad` folder:
    ```bower install --save monad
       cd ./httpdocs/admin && ln -s ../../bower_components/monad .```
2. The `index.html` supplied is usually good enough; symlink it:
   ```cd httpdocs/admin && ln -s monad/index.html .```
3. That's it really; now you can start building your own administrator!

## Setting up a build script
Monad uses ES6-style modules, but of course most current browsers don't know
what to make of those. You should use a simple build script like Gulp or Grunt
to package your files into a 'bundle' your browser can understand.

We personally prefer Gulp, so here's an example of a Gulp task for your
project:

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

Feel free to add stuff like `uglify`, sourcemaps etc. at will, but by default
Monad expects an `/admin/bundle.js` file.
