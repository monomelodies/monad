# A little history
You might wonder why the copyright notice goes back to 2008 ("they didn't even
have Angular back then!"). So, this is a short history of Monad to clarify
things and let you know where we came from. It should also explain a bunch of
design choices we made.

## In the beginning there was a Framework(tm)
We started out building a PHP framework called Monolyth, which actually dates as
far back as 2002 or so. This went through a number of iterations as we became
better programmers and learned from previous experience. The first versions of
it came bundled with a basic CMS, but around late 2008 we decided to split the
framework and the CMS into two separate modules. We called the CMS module
'Monad', which means 'the one' but was mostly short for 'MONolyth
ADministrator'.

Monad grew and was actually pretty extensible, but still very much tied to our
(custom) framework and thus a PHP backend. While that worked fine for most
projects, it was a bit annoying that occasionally we had to deal with other
CMSes like Wordpress, and also it lead to code duplication: both the admin as
well as the front-end site were generally written in PHP, but did separate
things - albeit with overlap, hence the duplication. DRY is good, so this was
suboptimal.

## AngularJS
Halfway through 2013 we became heavily immersed in AngularJS, and loved it. The
particular project we learned it for sported a Laravel backend, which worked
fine but seemed a little weird - there were all these APIs to power the Angular
frontend, but the backend essentially duplicated that in plain old PHP.

In 2014 we built a custom CMS in Angular for a different client, and this was
actually pretty awesome. We could reuse most of the API code from the
(front-end) Angular site, but more importantly we could use directives to
handle all custom data formatting and validation options.

*Sweet.*

So, the idea of an Angular-only CMS framework had been born. But as these things
go, it got postponed due to paying clients. You know how it works.

## Composer and decoupling FTW
Then, in the autumn of 2014, we seriously got into using Composer for PHP
package management (we used Git submodules until then) and began work on
repackaging our Monolyth framework as loosely coupled Composer modules.
That worked like a charm, so now the whole Monolyth framework is essentially a
`composer.json` file with our common dependencies.

Problem was, we would have to rewrite Monad too, and think of a way to make it
extendable and suitable for integration (the old framework relied on specific
`include_path` settings for that, which isn't very compatible with PSR-4) and,
in our newfound spirit of decoupling, as independent of other (PHP) modules as
possible.

We were also slightly concerned about Angular 2.0 coming up, as well as ES6. It
would be a breaking change, but there was no exact roadmap on support or even
release yet.

## Transpiling
So, we bit the bullet and started transpiling Javascript using Babel. The
underlying code is still Angular 1.x, but when Angular 2 comes around it will be
much easier to port. And the new Monad was born!

There was much rejoicing.

