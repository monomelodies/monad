# Main concepts
Monad uses AngularJS "components" together with "resources" to bootstrap a CMS
for you. Let's say your application is called `awesome` and you need to
administer a component ("section") called `Foo`. As an oversimplification, you
can think of `awesome` as the database and `Foo` as the table (though Monad can
talk to anything that exposes an API).

## Component-based routing
Whip up your favourite text editor and open your admin's `bundle.js` (or,
preferably, a source file which gets browserified into `bundle.js`).

> Best practice: we like to create directories for each component containing
> it's own isolated files, e.g. `./src/admin/Foo/...`. But it's really up to
> you how you want to organize your project.

As per version 2, Monad uses so-called "component-based routing". In
Angular-speak this means globally the following:

- A URL (any URL, in this case e.g. `/admin/foo/`) resolves to a basic tamplate
  like `<awesome-foo></awesome-foo>`.
- Using `angular.module(...).component(...)`, define a component of that name
  (in this example that would become `awesomeFoo`).
- The component (not the router, as previously) now handles everything.

Another thing to note is that most of the times you'll actually have two related
components for each editable section: the "list" (a list of items) and the
create/update component.

If our components don't need any special handling (and they won't for now, this
is a tutorial after all ;)) your Javascript would look much like the following:

```javascript
"use strict";

// Our main app depends on Monad
var app = angular.module('awesome', ['monad']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/:language/foo', {
        template: '<awesome-foo-list resource="$resolve.resource"></awesome-foo-list>',
        resolve: {resource: ['moResource', function (moResource) {
            return moResource('/api/foo');
        }]}
    });
    $routeProvider.when('/:language/foo/:id', {
        template: '<awesome-foo data="$resolve.data"></awesome-foo-list>',
        resolve: {data: ['moResource', '$route', function (moResource, $route) {
            return {foo: moResource('/api/foo/:id/', {id: '@id'}).get({id: $route.current.params.id})};
        }]}
    });
}]);
```

In the `config` function for the section, register the routes you need and
their components. For the default `list` implementation, pass a resolved
`$resource` object directly (we wrap in Monad's `moResource` factory for
reasons we'll explain shortly). For the CRUD implementation, pass the
resource(s) this section can modify under the `data` key.

## The actual components
These are often pretty simple; Monad does most of the heavy lifting for us. For
now, let's define them as follows:

```javascript
app.component('awesomeFooList', {
    template: '/your/list/template.html',
    bindings: {resource: '<'},
    controller: 'moListController'
});
app.component('awesomeFoo', {
    template: '/your/crud/template.html',
    bindings: {data: '<'}
});
```

Let's break that down:

- Create a `list` and a CRUD component for these operations. The names are
  technically irrelevant, `name` and `nameList` are just a convention.
- Note the `bindings` property on the component definition object. This is like
  `scope` in ordinary directives, but renamed for reasons we can't be bothered
  to research.
- The `list` variant uses the default `moListController`. This takes are of
  stuff like pagination for you.

## The templates
We're not going to force you to write your HTML in a certain way, but Monad does
come bundled with a number of components and directives to kickstart your admin
templates with.

### Lists
For the list view, you generally use something like this:

```html
<div class="container-fluid">
    <mo-list-header create="/foo/new/"><span translate>Foos</span></mo-list-header>
    <mo-list-table rows="$ctrl.items" update="/foo/:id/">
        <table><tr>
            <th property="foo" translate>Foo</th>
            <th property="bar" translate>Bar</th>
            <th property="baz" translate>Baz</th>
        </tr></table>
    </mo-list-table>
</div>
```

This is just a basic Bootstrap table with the specified column headers. The
`moListHeader` component injects a default header for the table with a title
and (if specified under the `create` binding) a link to create a new item.
Something similare goes for the `moListTable` component and its `update`
binding.

Finally, the `property` bindings in the `<th>` elements tells Monad which
property on each item in the list should appear in that column.

### CRUD
The CRUD view is more interesting, since it's actually going to tell Monad how
it should handle your data! Let's show a basic example first.

> As a convention, we personally put the list template in `./list.html` and the
> CRUD template in `./schema.html` in their respective section's folders, but
> once again it's up to you.

```html
<mo-update list="/foo/" item="$ctrl.item" type="foo" title="foo">
    <div class="row">
        <div class="col-md-12"><fieldset>
            <legend translate>Foo data</legend>
            <mo-field>
                <label translate>Foo</label>
                <input type="text" ng-model="$ctrl.data.foo.foo">
            </mo-field>
            <mo-field>
                <label translate>Bar</label>
                <input type="text" ng-model="$ctrl.data.foo.bar">
            </mo-field>
            <mo-field>
                <label translate>Baz</label>
                <input type="text" ng-model="$ctrl.data.foo.baz">
            </mo-field>
        </div>
    </div>
</mo-update>
```

That's right, it's more or less basic bootstrap, wrapped in an `moUpdate`
component. This is the component that contains the logic for saving your stuff
back to the API.

The `list` binding is the URL Monad should use for "one level up". Note that we
don't pass the language; the update template does that for us. The `item`
binding is the _main_ item being edited (more on that later). `type` is just a
string describing this type of item (for visual feedback), and `title` names the
property Monad should use in the header (e.g. "Editing Dave Grohl in `foo`"). If
you omit it Monad will guesstimate it.

Remember how in our component declaration we had a `data` binding? Well, it
contains the resolved `foo` resource object! We can edit away at will.

## Custom controllers
The supplied `moListController` generally does all you need for lists. For CRUD
components, notice how by default we don't specify any controller. That means
you're totally free to define your own! For example:

```javascript
app.component('awesomeFoo', {
    template: '/your/crud/template.html',
    bindings: {data: '<'},
    controller: function () {
        this.awesomeOperation = function () {
            //... go wild!
        };
    }
});
```

In your template, you would then have access to it like so:

```html
<a href ng-click="$ctrl.awesomeOperation()">click me!</a>
```

## Bootstrapping the admin
If you've tried to open your new admin already, you'll not see much happening.
This is because Monad requires you to manually "bootstrap" the application. Why?
Because otherwise we'd confine you to a certain `ng-app` name! We don't like to
confine you.

At the bottom of `bundle.js`, make sure you have the following:

```javascript
angular.element(document).ready(() => {
    angular.bootstrap(document, ['awesome']);
});
```

Of course, replace `"awesome"` with the actual name of your main module.

