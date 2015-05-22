# Monad

Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

Full documentation: http://monad-cms.readthedocs.org/en/latest/

## Getting the code
The quickest way is to use Monad's Bower package:

```bash
$ bower install --save-dev monad
```

Alternatively, download the source from Github and unpack it somewhere to your
liking, or add a Git submodule:

```bash
$ cd /path/to/where/you/keep/submodules
$ git submodule add https://github.com/monomelodies/monad.git
```

### Installing dependencies
If you didn't install the Bower package, you'll need Bower to install the
dependencies manually:

```bash
$ cd /path/to/monad
$ bower install
```

If you also want to hack on Monad itself, you'll want the Node packages too:

```bash
$ cd /path/to/monad
$ npm install
```

## Making Monad publicly available
In your `monad` directory, you'll notice bunch of other directories and files,
but the most important one for now is the `dist` directory. This is the compiled
etc. version of Monad ready for use. So, you'll need to make sure your web
server of choice can access it. Let's assume your site lives under `./httpdocs`
and your admin should be available under `./httpdocs/admin`. Monad will then
assume it lives under `./httpdocs/monad` (i.e., `/path/to/admin/../monad/`).
Your best option is to just add a symlink to the `dist` folder under that alias:

```bash
$ cd /path/to/httpdocs/admin/../
$ ln -s /path/to/monad/dist ./monad
```

If you want to name your `admin` folder `slartibarfast` or whatever, that's fine
by us. Monad doesn't by design care where it lives; all paths are relative.

In the `dist` folder, you'll notice an `index.html`. You could write your own,
but this is Monad's default and generally works like a charm. The `/admin/` path
needs access to it, so again we can symlink:

```bash
$ cd /path/to/httpdocs/admin
$ ln -s ./monad/index.html .
```

And that's it! You're ready to roll.

If for whatever reason you can't symlink, you'll need to copy some files around
and preferably set up a build script to watch changes. Added bonus here is that
a build script can transpile your ES6 code to ES5 (which is what Monad does
too), so we'd think it's generally a good idea. We'll give you an example in
Gulp (our preferred tool) in the next chapter, but something similar would work
for other systems (e.g. Grunt).

An alternative would be to place Monad in a public path directly and use e.g.
Apache aliases to point the browser to the right location.

