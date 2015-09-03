# Translating your administrator
For large(r) projects, the need to be able to translate your administrator into
multiple languages often arises. This is (relatively) easy in Monad.

## Configuring `angular-gettext`
Monad internally uses [`angular-gettext`](https://angular-gettext.rocketeer.be/)
to provide so-called "i18n" to your administrator. Generic texts like "please
login" are provided and autoloaded; a project-specific translation file is also
autoloaded (but will of course return a 404 if not provided).

Follow the instructions for `angular-gettext` to set it up inside your
_project_; we can't reuse the Monad copy.

## Generating or creating a `.pot` file
GNU-gettext uses "catalogs" stored in so-called `.pot` files. These are
templates for your translations. Where you store it doens't really matter, but
the convention is to create a `./po` folder in the root of your project.

`angular-gettext` comes with tools to automatically extract strings from your
templates. Please refer to their documentation. Alternatively, you can manually
fill your `.pot` file. The `angular-gettext` documentation also contains hints
on how to use a number of popular editors to edit and translate your templates;
we personally use `poedit` but any one will do.

## Translating strings
That's your job :) Some editors offer translation hints, but in the end it's
going to require some manual work.

## Linking object properties to human-readable text
In your `<mo-list-table>` directives, simply add the `translate` attribute to
your table headings:

```php
<mo-list-table>
    <table>
        <tr>
            <th property="id" translate>ID</th>
        </tr>
    </table>
</mo-list-table>
```

> You need to wrap it in a complete, valid table, or some browsers will barf on
> you and you'll be wandering why your headers are missing.

The same goes for your `schema.html` files; just translate what you need.

## Compiling translations for use
Once you've generated a `.pot` template, translated all the strings and saved
your various language files as `.po` files, run the Grunt task supplied by
`angular-gettext` to compile to JSON. The output path should be
`/path/to/my/admin/i18n`. The names of the files should correspond to whatever
language given in the URL via the `/:language/` parameter, i.e. for `en` there
should be a file `i18n/en.json`.

