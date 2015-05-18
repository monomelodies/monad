Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

## Getting the code
The quickest way is to use Monad's Bower package:

    $ bower install --save-dev monad

Alternatively, download the source from Github and unpack it somewhere to your
liking, or add a Git submodule:

    $ cd /path/to/where/you/keep/submodules
    $ git submodule add https://github.com/monomelodies/monad.git

### Installing dependencies
If you didn't install the Bower package, you'll need Bower to install the
dependencies manually:

    $ cd /path/to/monad
    $ bower install

If you also want to hack on Monad itself, you'll want the Node packages too:

    $ cd /path/to/monad
    $ npm install

## Making Monad publicly available
In your `monad` directory, you'll notice bunch of other directories and files,
but the most important one for now is the `dist` directory. This is the compiled
etc. version of Monad ready for use. So, you'll need to make sure your web
server of choice can access it. Let's assume your site lives under `./httpdocs`
and your admin should be available under `./httpdocs/admin`. Monad will then
assume it lives under `./httpdocs/admin/monad`. Your best option is to just add
a symlink to the `dist` folder under that alias:

    $ cd /path/to/httpdocs/admin
    $ ln -s /path/to/monad/dist ./monad

If you want to name your `admin` folder `slartibarfast` or whatever, that's fine
by us (see further down on how to set the base path).

In the `dist` folder, you'll notice an `index.html`. You could write your own,
but this is Monad's default and generally works like a charm. The `/admin/` path
needs access to it, so again we can symlink:

    $ cd /path/to/httpdocs/admin
    $ ln -s ./monad/index.html .

And that's it! You're ready to roll.

If for whatever reason you can't symlink, you'll need to copy some files around
and preferably set up a build script to watch changes. Added bonus here is that
a build script can transpile your ES6 code to ES5 (which is what Monad does
too), so we'd think it's generally a good idea.

### Setting up a build script
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

1. Put the Monad source inside the public folder you want to use to access your
   admin, e.g. `./httpdocs/admin`.
  - Monad would now live in `./httpdocs/admin/monad`.
  - Alternatively, install using e.g. Bower and symlink the `monad` folder:
    ```bower install --save monad
       cd ./httpdocs/admin && ln -s ../../bower_components/monad .```
2. The `index.html` supplied is usually good enough; symlink it:
   ```cd httpdocs/admin && ln -s monad/index.html .```
3. That's it really; now you can start building your own administrator!

