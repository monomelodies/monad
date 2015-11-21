# Monad

Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

Full documentation: [http://monad.monomelodies.nl/docs/](http://monad.monomelodies.nl/docs/)

## Getting the code
The quickest way is to use Monad's Bower package:

```bash
$ bower install --save monad
```

Alternatively, [download the source from Github](https://github.com/monomelodies/monad/)
and unpack it somewhere to your liking, or add a Git submodule:

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

If you're going to hack on Monad itself, you'll want the Node packages too:

```bash
$ cd /path/to/monad
$ npm install
```

Monad uses [Grunt](http://gruntjs.com/) for building, so in that case you'll
want that too:

```bash
$ sudo npm install -g grunt-cli
```

> Your own project can use a different task runner like Gulp, or none at all.

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
too), so we'd think it's generally a good idea (adding a build script, not
copying files around!). We'll give you an example in Grunt (our preferred tool)
in the next chapter, but something similar would work for other systems (e.g.
Gulp).

An alternative could be to use e.g. Nginx or Apache aliases to point the browser
to the right location for `/monad`. Example in Nginx:

```
server {
    # all your other stuff...

    location /monad/ {
        root $BASE/bower_components/monad/dist;
    }
}
```

> Using server-side aliases is our own preferred method these days, but you'll
> need a bit more control over your environment to make that work. For instance
> on a shared host you'll often need to resort to symlinking or copying.

