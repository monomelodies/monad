# Monad

Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

Full documentation: [http://monad.monomelodies.nl/docs/](http://monad.monomelodies.nl/docs/)

## Installation

### NPM
```bash
$ npm install --save monad-cms
```

Monad is transpiled to ES5 in the CommonJS format, so assuming you're using
Browserify or something compatible you can do this in your admin's main entry
point (e.g. `./src/admin/my-awesome-admin.js`):

```js
var monad = require('monad-cms');
```

...or, if you're more into ES6 and transpiling like us:

```js
import monad from 'monad-cms';
```

### Bower
```bash
$ bower install --save monad
```

Add a link to the bundled ES5 file in your HTML template:

```html
    <!-- other html... -->
    <script src="bower_components/monad/dist/monad.js"></script>
    <!-- ...or: -->
    <script src="bower_components/monad/dist/monad.min.js"></script>
    <!-- now load your own Javascript for the admin: -->
    <script src="my-awesome-admin.js"></script>
</body>
```

Make sure Monad comes _before_ your own admin scripts. No need to `require` it
now!

### Installing dependencies (for development)
If you're going to hack on Monad itself, you'll want to clone or fork the repo
instead of installing via NPM.

```bash
$ git clone https://github.com/monomelodies/monad.git
& cd monad
$ npm install
```

> Note that the NPM package is called `monad-cms`, but the Bower package and
> repository are simply named `monad`. `monad` was already taken on NPM, that's
> why.

Monad uses [Grunt](http://gruntjs.com/) for building, so in that case you'll
want that too:

```bash
$ sudo npm install -g grunt-cli
```

> Your own project can use a different task runner like Gulp, or none at all.

## Including Monad in your project
Until now we don't have anything to load in a browser yet. Let's change that.
Pick a public folder (the name doesn't matter, so let's assume `/admin/`).
Using your favourite text editor, add the following `index.html` there:

```html
<!doctype html>
<html ng-strict-di ng-app="name-of-your-admin-module">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Title of your project admin</title>
        <link href="/path/to/your/admin.css" rel="stylesheet">
        <base href="./">
    </head>
    <body role="document">
        <monad-login>
            <div class="theme-showcase" role="main" ng-view></div>
        </monad-login>
        <monad-footer></monad-footer>
        <!-- optional: bower bundle, see above -->
        <script src="/path/to/your/bundle.js"></script>
    </body>
</html>
```

The `<meta>` tags are optional but usually a good idea, as is `ng-strict-di`.
Note the `<base href="./">` tag - this is required for Angular routing to work.

We already added two directives included in the core CMS package:
`<monad-login>` and `<monad-footer>`. The first shows a login screen if the
current user isn't authenticated (which is likely what you'll get when you run
this example since we haven't defined authentication yet...), the second shows
Monad's default footer with optional logout button and language selection, as
well as our copyright notice.

Typically admins are only open to selected users, so usually you'll want to wrap
your `ng-view` directive in `monad-login`. `monad-footer` is entirely optional.
Please note that the MIT license _does_ require you to include it, so if you
write your own implementation please take care of that!

## Writing your admin
You now write your admin code in Javascript in whatever way you please! Wait, is
that all??? Of course not. As per version 3 Monad uses a plugin based
architecture, much like you would include Angular dependencies in a "normal"
project. For starters, these are the officially maintained plugins:

- [monad-navigation](https://github.com/monomelodies/monad-navigation) A menu
  builder component for easy navigation of your admin.
- [monad-multilang](https://github.com/monomelodies/monad-multilang) Multi
  language support for your admin.
- [monad-crud](https://github.com/monomelodies/monad-crud) Easy CRUD operations
  for your project's data.

Install plugins using NPM or Bower, and `require` or add script tags for them as
needed. Then, add them as an extra dependency for your main module. See the
individual plugins for documentation on their usage.

The rest of Monad is "just" an Angular application, so simply define routes
using `$routeProvider` and start coding admin stuff! Monad includes the
[Bootstrap CSS framework](https://getbootstrap.com) to get you started quickly,
but is also completely customisable if you'd rather rebrand to for your
project's own style. Speaking of which...

## Styling


### When installed via NPM

### When installed via Bower

### When installed manually (download, clone, fork etc.)
You'll need to build the package first. Use either of these:

To build for development and start watching for changes:
```sh
$ grunt dev
```

To build for production (no watch, but do minify/uglify):
```sh
$ grunt prod
```

Then load whichever way you prefer (`require('/path/to/monad/es5')` or using
`<script src="path/to/monad/dist/monad.js"></script>`).

Pick a folder (any folder, e.g. `/admin/`) to host your CMS from. Monad will
expect the following files there, examples (or simply usable versions) of which
are located in Monad's `./dist` directory:

- `index.html`: The entry point. The provided one is often good enough; see
  elsewhere in the manual for hints on how to customise further.
- `monad.js`: Monad's browserified bundle.
- `admin.css`: The default `index.html` expects a stylesheet of that name in the
  root of your admin. You can use the provided one or build your own theme, as
  long as you name it `admin.css` (note: if you write your own `index.html` from
  scratch you can of course call it whatever you like).
- `logo.png` and `i18n.png`: The Monad logo and a sprite of language icons,
  respectively. You're perfectly free to substitute these with your own.
- `fonts`: Folder with Bootstrap fonts.

Monad by default expects your project-specific admin code to live in
`/your-admin-dir/bundle.js`. You can generate this via either a tool like
Browserify, or just write all your code in one file - not recommended, but we
honestly don't care ;)

To create an admin `bundle.js` including Monad, point Browserify to an entry
poiny (e.g. `./src/admin/myProject.js`) and create an Angular module that
depends on (at least) Monad:

```javascript
"use strict";
angular.module('myProjectAdmin', ['monad']);
```

And either `ln -s`, `cp` or Grunt copy/watch the files you need... That's it!
You're ready to roll. Your brand new CMS will now be available under the chosen
path.

## Now what?
Well, you'll have to write some code now. See the [building
blocks](blocks/index.md) section to get you started, and the [advanced
techniques](advanced/home.md) section afterwards to learn how to wield the
power of Monad to your customised advantage.

