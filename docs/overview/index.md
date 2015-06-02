Monad comes with an `index.html` file that is a good skeleton for your admin
application. Of course, you could write your own, but for defaults it's usually
fine to use the supplied one.

    $ cd /path/to/admin
    $ ln -s /path/to/monad/index.html .

By default, all paths are relative to the `admin` path (whatever you call it),
and Monad itself assumes it lives in a sibling directory called `monad`.

> If you really need to rename `monad` to something else or place it elsewhere,
> consider working some magic with Apache aliases or another proxy mechanism.

