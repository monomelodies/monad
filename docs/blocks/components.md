# Components
We saw in the [navigation section](navigation.md) how our routes simply refer to
a template with a component directive. You'll need to define those for every
admin-y thing you want to appear in your administrator.

> Best practice: use a consistent naming scheme. E.g. `/admin/section/:id?`
> refers to components `adminSectionList` and `adminSection` respectively. We
> personally also prefer to break up and group stuff into separate files, e.g.
> `./src/admin/section/...` and use Browserify to bundle stuff.

These components are often pretty simple; Monad does most of the heavy lifting
for us. For now, let's define them as follows:

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
  `scope` in ordinary directives, but renamed in Angular components for reasons
  we can't be bothered to research.
- The `list` variant uses the default `moListController`. This takes are of
  stuff like pagination for you.

## The list template
We're not going to force you to write your HTML in a certain way, but Monad does
come bundled with a number of components and directives to kickstart your admin
templates with.

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

## The CRUD view
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

## Creating new items
Obviously we can't use `$resource` to load a new item (since it doesn't exist
yet, D'OH!). But we have you covered! For the special "add new item" case,
define a route for creation (often _before_ the update route, since typically
these will look like `/some/item/:id` and `/some/item/create` and `ngRoute`
returns whatever matches first). Instead of `$route` we inject the `moModel`
factory and return its result with the resource as a parameter:

```javascript
$routeProvider.when('/:language/foo/create', {
    template: '<awesome-foo data="$resolve.data"></awesome-foo>',
    resolve: {data: ['moResource', 'moModel', function (moResource, moModel) {
        return {foo: moModel(moResource('/api/foo/:id/', {id: '@id'}))};
    }]}
});
```

The `moModel` factory creates an _empty_ model object and attaches the specified
resource, so the model knows what to do when you click "save changes".

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

To use a custom controller on a list but _still_ be able to use
`moListController`'s pagination etc., you can simply use `ng-controller` in your
template and alias the custom controller as e.g. `list`:

```html
<div ng-controller="myCustomController as list">
    We now have {{ $ctrl.items.length }} items from the parent list,
    as well as {{ list.customProperty }} available!
</div>
```

Or you could of course create a component which would be slightly neater and
also allows you to bind e.g. `$ctrl.items` to it.

## Dirty checking
For convenience, the `moListController` also supports dirty checking via the
custom `$dirty()` method:

```html
<div ng-if="$ctrl.$dirty()">I'm so dirty right now</div>
```

A list is considered dirty if at least one item in it is dirty.

## Non-list/CRUD sections
You can register anything as a route/component, so if you need a page with e.g.
user statistics, just build it and add it to the menu! (Or keep it hidden of
course, nothing requires you to register every URL on a menu.)

