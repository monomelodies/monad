# Translating your administrator
For large(r) projects, the need to be able to translate your administrator into
multiple languages often arises. This is (relatively) easy in Monad.

## Configuring `angular-gettext`
Monad internally uses [`angular-gettext`](https://angular-gettext.rocketeer.be/)
to provide so-called "i18n" to your administrator. Generic texts like "please
login" are provided by Monad in English and Dutch; it's up to you to mark and
provide translations for your own components and/or other languages.

> Monad contains the `i18n.png` sprite with "flags of the world". Refer to
> `./src/_sass/_flags.scss` for the correct classname for your language. E.g.
> for the class `.en` the language string should be stored as `"en"`, whereas
> Welsh uses `.wales`/`"wales"`.

If you installed Monad via NPM (and have the dev dependencies) you'll already
have a copy of `angular-gettext` available. Otherwise, follow the instructions
for `angular-gettext` to set it up inside your project. [The website contains
clear instructions.](https://angular-gettext.rocketeer.be/)

## Generating or creating a `.pot` file
GNU-gettext uses "catalogs" stored in so-called `.pot` files. These are
templates for your translations. Where you store it doens't really matter, but
the convention is to create a `./Locale` or `./po` folder in the root of your
project.

`angular-gettext` comes with tools to automatically extract strings from your
templates. Please refer to their documentation. Alternatively, you can manually
fill your `.pot` file. The `angular-gettext` documentation also contains hints
on how to use a number of popular editors to edit and translate your templates;
we personally use `poedit` but any one will do.

## Translating strings
That's your job :) Some editors offer translation hints, but in the end it's
going to require some manual work.

## Linking object properties to human-readable text
In your templates, simply add the `translate` attribute to any element you want
to translate. E.g., in a `list` template's table headings:

```html
<mo-list-table>
    <table>
        <tr>
            <th property="id" translate>ID</th>
        </tr>
    </table>
</mo-list-table>
```

Just mark whatever you need translated. Usually this is either "nothing" or
"everything" ;)

## Compiling translations for use
Once you've generated a `.pot` template, translated all the strings and saved
your various language files as `.po` files, run the Grunt task supplied by
`angular-gettext` to compile to Javascript.

> _Do not add a module name._ Imports get "hoisted", so if you try to use a
> custom module name it won't exist yet during inclusion. Just use the default
> (`"gettext"`) which is guaranteed to exist and on which Monad itself already
> depends.

## Importing translations in your admin
This is now as simple as:

```javascript
// ES6
import '/path/to/i18n.js';
// Browserify
require('/path/to/i18n.js');
```

...or, if you're not using these, concatenate or copy/paste.

