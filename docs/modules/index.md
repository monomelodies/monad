# Modules

In Monad, each "thing" you want to administer is registered as a "module". Let's
say, for the example, our module is called `Twitter`:

    import {Monad} from "/monad/assets/js/monad";
    import {Twitter} from "./path/to/twitter";

    Monad.registerModule(new Twitter());

It is the module's base class's job to bootstrap it. Our Twitter bases class
could for instance be implemented like so:

    import {Monad_Module} from "/monad/assets/js/monad";

    export class Twitter extends Monad_Module
    {
    }

Menus have three layers: the module, the "thing" to work on, and associated
options:

    `#/module/thing/option`

Additionally, an ID may be passed which must be resolvable to a unique ID in
your API call:

    `#/module/thing/option/id`

These must then be defined in your provider. E.g., say we have a "tweet" thing
through which we want to be able to read and write tweets:

    export class Tweet_Provider
    {
        get tweets() {
        }
        get tweet
    }

