# Wordpress plugin sample app

Code is best explained by examples, so let's get out hands dirty and setup a
Monad plugin for the popular Wordpress blog system.

When plugging into Monad, there's a number of important concepts to wrap your
head around:

- The API interface

## Connecting to the API

First and foremost, we have to tell our plugin how to communicate with the
backend. We're going to use the more-or-less official WP JSON API for this. The
following assumtions are made in this tutorial with respect to paths:

- Monad is publicly available under `/monad/`;
- Wordpress is installed under `/wordpress/` and the JSON API plugin is setup;
- Our module is available under `/modules/wordpress/`.

Let's start by defining our base module class in `/modules/wordpress/wp.js`:

    import {Module} from "/monad/assets/js/monad";

    export class WP extends Module
    {
        constructor() {
            this._api = '/wordpress/wp-json';
            this._name = 'wordpress';
        }
    }

## Registering the plugin

We need a central file that tells Monad what plugins we have. Monad assumes this
can be imported from `/js/monad`. Let's create it:

    import {Monad} from "/monad/assets/js/monad";
    import {WP} from "/modules/wordpress/wp";

    Monad.registerModule(new WP());

## Setting up post actions


