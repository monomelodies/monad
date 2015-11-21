# Basic customisation
Monad has a few quick and dirty customisation options for most day-to-day
customisation.

## Values

```javacript
monad.application('foobar')
    .value('name', 'custom value');
```

- #### title ####

    A string with the title of your admin. Most clients will want their own name
    here instead of the default :)

- #### theme ####

    URL (relative to the admin directory, of course) of the theme CSS. We offer a
    Bootstrap-based default - feel free to customise. You can either write something
    from scratch if you want, or extend the existing theme (all our CSS is written
    using [SASS](http://sass-lang.com/), so importing/overriding is easy).

## Constants

```javacript
monad.application('foobar')
    .constant('anotherName', 'custom constant');
```

- #### languages ####

    Array of languages Monad should support. Currently we include English and
    Dutch, so feel free to contribute (see `./src/i18n/` for the language files).

    The default value is `['en', 'nl']`. The first language listed is considered
    the default language if none was specified. We provide icons for most officially
    recognised countries - see `./assets/i18n/`. No, it does not include Klingon so
    you'd have to do some tinkering if you _really_ need to support an addiotional
    language _and_ want the icon to show up.

