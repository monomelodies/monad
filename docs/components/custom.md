# Custom directives, filters and other stuff
Go wild, define and use whatever you need. You can place them in submodules too,
just remember to add the dependency when you call `monad.application`.

> Other custom submodules usually don't warrant a Component; these are meant for
> "stuff that shows up in a menu", or - to be more precies - parts of your
> application that actually define a `$route`. Rule of thumb: if it has a
> Manager, it's a component; otherwise, (probably) not.

