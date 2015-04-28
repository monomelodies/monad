# Introduction
Monad is organized around the concept of `modules`, not to be confused with
Angular modules (at least, not entirely). In Monad, a `module` is defined as
a coherent set of data getters/setters which corresponds to a unit of
business logic in your domain. For example, when using Monad as a frontend to
Wordpress, you would have a module `wordpress` which takes care of all
Wordpress-related stuff, but maybe also a module `foo` handling something else
altogether.

Within each module, you will have one or more 'groups' of functionality.
Expanding on Wordpress as an example, the `wordpress` module could contain
groups for `posts`, `comments` and `pages` (Wordpress can do more of course, but
let's keep it simple for now).

# Defining a module
> You will likely want to use a build system (e.g. Gulp) to glue all of this
> together and run your code through a transpiler like Babel (the default).
> Setting up a build system is outside the scope of this tutorial, but example
> files for Gulp are included in the distribution.

First, choose a logical place in your code to store all modules (e.g.
`/src/monad/modules/`). It's good practice - but not required - to store all
files for a module in their own subdirectory, e.g.
`/src/monad/modules/wordpress/`.

    import Module from '/monad/core/module/Module';

    class Wordpress {
    }

    Module.register('wordpress');

