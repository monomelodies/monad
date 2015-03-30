# Modules
Monad works with the concept of 'modules', but in the ES6-sense, not the
Angular-sense. Each module in essence exposes two views: a data list and a
data form (for editing a single item). As an example, let's show how to make a
module where we manage our favourite programming languages.

> No controversy intended; these aren't necessarily _our_ favourite languages!

## Setup
First, create a folder somewhere that will contain all your module's files. This
isn't strictly required by Monad, but it makes your code more reusable since a
module's folder can be picked up and placed in another project easily.

    $ mkdir Proglang && cd Proglang

For easy importing, we'll also define a single entry point called `module.js`.
Again, this isn't strictly required but it prevents us from having to write a
bunch of `import` statements every time we want to use the module.

    // Proglang/module.js
    "use strict";


