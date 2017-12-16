# Monad

Generic AngularJS-based CMS framework

Adding an administrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

Full documentation: [http://monad.monomelodies.nl/monad/docs/](http://monad.monomelodies.nl/monad/docs/)

[Read about the history for this project.](overview/history.md)

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

## Upgrading from 2.x
If you're upgrading from Monad 2.x keep the following in mind:

### Plugin architecture
Monad 3.x uses a plugin-based architecture and many functionality has been moved
to such a plugin. As such, you'll most likely want to install one or more
plugins for your admin to behave like before.

### New prefix for components, directives, services etc.
Monad 1.x and 2.x used the `mo` prefix for these. Monad 3.x uses the slightly
more verbose but clearer `monad` prefix. You should rename them, and also keep
in mind that not all 3.x components are 100% backwards compatible.

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

> The `<meta>` tags are optional but usually a good idea, as is `ng-strict-di`.
> Note the `<base href="./">` tag - this is required for Angular routing to
> work.

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
- [monad-drag-drop](https://github.com/monomelodies/monad-drag-drop) Drag and
  drop support.
- [monad-sortable](https://github.com/monomelodies/monad-sortable) Sortable data
  lists.
- [monad-slug](https://github.com/monomelodies/monad-slug) Support for slugs.

Install plugins using NPM or Bower, and `require` or add script tags for them as
needed. Then, add them as an extra dependency for your main module. See the
individual plugins for documentation on their usage.

The rest of Monad is "just" an Angular application, so simply define routes
using `$routeProvider` and start coding admin stuff! Speaking of which...

## Authentication
Monad supports multiple levels of authentication out of the box. E.g., all
sections of your admin would be available to "root users", but only "writing
blog posts" is available to editors. Authentication is explained in the
[prerequisites section](overview/prerequisites.md) and there's also a [more
detailed example](examples/authentication.md) showing how to identify various
roles in your application.

## Styling
If you installed via NPM you can `@import` the `style.css` file from the `lib`
directory (if it's available publicly). When using `sass`, you can also
`@import '/path/to/monad-cms/lib/default'`.

If you installed via Bower you'll want to add a link to
`'bower_components/monad/dist/style.css'` to the `<head>` of your admin's
`index.html`.

Or you could write your own CSS from scratch. That's fine by us. In that case,
starting by including Bootstrap will give you a running start.

Monad includes the [Bootstrap CSS framework](https://getbootstrap.com) by to get you started quickly,
but is also completely customisable if you'd rather rebrand to for your
project's own style.

## Further reading
You'll notice that up until now we haven't said a word about server side code,
database queries etc. That's because Monad doesn't care by design - but you
_will_ need them. [See the prerequisites section](overview/prerequisites.md) (up
next) for some hints on how to actually start administering something.

## Contributing
Bug reports, feature requests etc. should go via Github. If you feel like fixing
something yourself (awesome, you!) issue a pull request. In lieu of a formal
style guide, please try to be consistent with existing coding styles.

If you've simply created a plugin that you think other people might also find
useful (I don't know, e.g. something to easily integrate with Laravel projects),
please drop me a line. We'll advertise it as a user contributed plugin (assuming
it works properly ;)).

