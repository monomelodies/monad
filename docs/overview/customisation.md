Monad has a few quick and dirty customisation options which are stored as
Angular `value`s. Simply call `value` on your application to override them:

    monad.application('foobar')
        .value('name', 'custom value');

## `title`
A string with the title of your admin. Most clients will want their own name
here instead of the default :)

## `languages`
Array of languages Monad should support. Currently we include English and
Dutch, so feel free to contribute (see `./src/i18n/` for the language files).

The default value is `['en', 'nl']`. The first language listed is considered
the default language if none was specified. We provide icons for most officially
recognised countries - see `./assets/i18n/`. No, it does not include Klingon so
you'd have to do some tinkering if you _really_ need to support an addiotional
language _and_ want the icon to show up.

## `theme`
URL (relative to the admin directory, of course) of the theme CSS. We offer a
Bootstrap-based default - feel free to customise. You can either write something
from scratch if you want, or extend the existing theme (all our CSS is written
using SASS, so importing/overriding is easy).

## `ckeditor`
Default config object for CKEditor. This actually extends a bunch of Monad
defaults, and you can in turn override values when you call `monad.ckeditor` in
your view templates (but see the section on Components > Templates).

