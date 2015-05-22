# Setting up a build script
Monad uses ES6-style modules, but of course most current browsers don't know
what to make of those. Monad comes with a browser-of-today enabled bundle in
`./dist/bundle.js`. The supplied `./dist/index.html` loads this for you prior to
loading your custom admin.

When you look at `index.html`, you'll notice that after the `libraries.js` and
`bundle.js` files, it attempts to load a `bundle.js` from the current directory.
This is where your custom admin code is loaded, so it's up to you to make sure
that file exists.

The simplest way is of course to just write all your code in `./bundle.js` in
your admin-or-wherever directory, which works as a poor man's solution. A better
strategy is to setup a build script to generate that for you. This has the added
bonus that you, too, can write your code in ES6.

## Gulp build script
We personally prefer Gulp, so here's an example of a Gulp task for your
project:

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

Feel free to add stuff like `uglify`, sourcemaps etc. at will, as long as you
eventually output to `/admin/bundle.js`.

Setting up Gulp to simply copy static files to a public directory is trivial;
you could use something like this:

```javascript
gulp.src('./src/admin/**/*.html', {base: './src/admin'})
    .dest('./httpdocs/admin');
gulp.src('./src/admin/**/*.json', {base: './src/admin'})
    .dest('./httpdocs/admin');
```

...and rinse and repeat for any other static assets you want to expose.

> Of course, you could also use symlinks for that; it depends on your preference
> and whether or not your host allows you to do that.

## Grunt build script
Feel free to submit one, we don't use Grunt :)

