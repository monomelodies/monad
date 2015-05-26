# RootController
Default root controller registered on the `<html>` element.

## Usage
Unless you have special needs beyond basic customisation, the default will
suffice. If you need to roll your own, you can. Register it under the name
`moController` and all will be well.

> Note that the default `index.html` template counts on a number of properties
> from the RootController API to be available. When rolling your own, either
> extend the Monad RootController, or make sure they're available.

## API

- #### Authentication ####

    Getter for the current
    [Authentication service](../services/authentication.md).

- #### Navigation ####

    Getter for the [Navigation service](../services/navigation.md).

- #### language ####

    Getter for the current language.

- #### languages ####

    Getter for all available languages.

- #### logout() ####

    Attempts to login the current user; redirects to the login page on success.

- #### url() ####

    Returns the current path as defined by `$location.path`.

- #### license() ####

    Shows the Monad license.

