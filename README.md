# Monad
Generic AngularJS-based CMS framework

Adding an amdministrative backend to a dynamic website is almost always
necessary, but a lot of work by default. Monad aims to provide a platform
agnostic toolkit which allows for easy and quick scaffolding of such a
backend, communicating with your site via APIs.

## Installation
1. Navigate to the root of your project.
2. $ sudo npm install jspm -g
3. $ npm install jspm
  * Enter the correct value for your public dir (e.g. `httpdocs`) and set the
    public root to `/`.
  * Use `vendor` as the folder where to store dependencies. This makes jspm more
    consistent with tools like Composer. If you go for something else, you'll
    have to remember to change some paths here and there.
4. Create a public folder where you'll run your admin, e.g. `httpdocs/admin`.
5. Ensure the public folder is accessible to the webserver.
  * Either Symlink `index.html` from Monad here, or
  * Use a server-side language such as PHP to "include" it. This has the benefit
    of allowing you to optionally rewrite paths andsoforth.

That's it! Your ready to start piecing together your backend.

## Setup
