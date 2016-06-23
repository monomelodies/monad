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

You can also use Bower:

```bash
$ bower install --save monad
```

Alternatively, [download the source from Github](https://github.com/monomelodies/monad/)
and unpack it somewhere to your liking, or add a Git submodule:

```bash
$ cd /path/to/where/you/keep/submodules
$ git submodule add https://github.com/monomelodies/monad.git
```

### Installing dependencies (for development)
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
Pick a folder (any folder, e.g. `/admin/`) to host your CMS from. Monad will
expect the following files there, examples (or simply usable versions) of which
are located in Monad's `./dist` directory:

- `index.html`: The entry point. The provided one is often good enough; see
  elsewhere in the manual for hints on how to customise further.
- `monad.js`: Bundled Javascript library. Normally you should just symlink this
  into your public folder (or copy/watch using e.g. Grunt). There's also a
  minified `monad.min.js` for production.
- `admin.css`: The default `index.html` expects a stylesheet of that name in the
  root of your admin. You can use the provided one or build your own theme, as
  long as you name it `admin.css` (note: if you write your own `index.html` from
  scratch you can of course call it whatever you like).
- `logo.png` and `i18n.png`: The Monad logo and a sprite of language icons,
  respectively. You're prefectly free to substitute these with your own.
- `fonts`: Folder with Bootstrap fonts.

Monad by default expects your project-specific admin code to live in
`/your-admin-dir/bundle.js`. You can generate this via either a tool like
Browserify, or just write all your code in one file - not recommended, but we
honestly don't care ;)

So either `ln -s`, `cp` or Grunt copy/watch the files you need... And that's it!
You're ready to roll. Your brand new CMS will now be available under the chosen
path.

## Now what?
Well, you'll have to write some code now. See the [building
blocks](blocks/index.md) section to get you started, and the [advanced
techniques](advanced/home.md) section afterwards to learn how to wield the
power of Monad to your customised advantage.

