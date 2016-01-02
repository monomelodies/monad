# Monad

Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

Full documentation: [http://monad.monomelodies.nl/docs/](http://monad.monomelodies.nl/docs/)

## Getting the code
The quickest way is to use Monad's NPM package:

```bash
$ npm install --save monad-cms
```

Alternatively, [download the source from Github](https://github.com/monomelodies/monad/)
and unpack it somewhere to your liking, or add a Git submodule:

```bash
$ cd /path/to/where/you/keep/submodules
$ git submodule add https://github.com/monomelodies/monad.git
```

### Installing dependencies
If you didn't install the NPM package, you'll need to install the dependencies
manually:

```bash
$ cd /path/to/monad-cms
$ npm install
```

If you're going to hack on Monad itself, you'll want to clone the repo instead
of installing via NPM.

```bash
$ git clone https://github.com/monomelodies/monad.git
& cd monad
$ npm install
```

> Note that the NPM package is called `monad-cms`, but the repo is simply named
> `monad`. `monad` was already taken on NPM, that's why.

Monad uses [Grunt](http://gruntjs.com/) for building, so in that case you'll
want that too:

```bash
$ sudo npm install -g grunt-cli
```

> Your own project can use a different task runner like Gulp, or none at all.

## Making Monad publicly available
Pick a folder (any folder, e.g. `/admin/`) to host your CMS from. Copy, link or
otherwise include Monad's `./index.html` file from the root there. If you open
it up in your favourite text editor, you'll notice it tries to load a few
additional external files:

- #### `admin.css`
  This must contain your admin styles. If you're not doing anything spectacular,
  you can generate it using SASS by simply importing Monad's default:
  `@import '/path/to/monad/src/_sass/default'`.
  > Note that Monad itself depends on Bootstrap, so e.g. in your Grunt task you
  > would have to add the following:
  > `loadPath: ['node_modules/monad-cms/node_modules/bootstrap-sass/assets/stylesheets']`

- #### Glyphicons
  Bootstrap comes with the Glyphicon icon font set, so you'll also need to copy
  those files into your public admin:
  `cp -r node_modules/monad-cms/node_modules/bootstrap-sass/assets/fonts /path/to/public/admin/`

- #### `bundle.js`
  This contains all your Javascript admin code. The recommended way is to use
  Browserify in combination with a transpiler like Babel to generate this. If you
  don't know how that works, don't fret: we'll explain elsewhere in the
  documentation.

And that's it! You're ready to roll.

