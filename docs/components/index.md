We saw earlier how Monad works with the concept of 'modules', both in the
ES6-sense as well as the Angular-sense. Let's dive into that a bit further.
You can think of a module as 'an option that shows up in the (main) menu',
although technically it is not required to actually expose modules in any menu.

> To differentiate between AngularJS and ES6 modules, Monad refers to them as
> "components" instead.

## Setup
First, create a folder somewhere that will contain all your module's files. This
isn't strictly required by Monad, but it makes your code more reusable since a
module's folder can be picked up and placed in another project easily.

So, for our fictional module `Foo` we make a folder `foo` under `admin`
to place all our files in. By convention, we create an entry point called
`angular.js` here which hooks everything up to our Angular module:

    // foobar/angular.js
    "use strict";

    monad.module('foobar', 'foo')
        // <- define custom stuff here
        ;

Note that we're still naming our application `foobar`. The 'custom stuff' will
generally consist of one or more of the following:

    monad.module('foobar', 'foo')
        // Manager class, available as `foobarFooManager` in Angular:
        .manager(Manager)
        // API URL to show a list of items:
        .list('/my/url/', {
            // Omit or set to true (default) to have this show up in the main
            // top menu. The text ID used is `monad.navigation.COMPONENT`, or
            // `monad.navigation.foo` in this example:
            menu: false,
            // Array of column names to include in the list:
            columns: ['col1', 'col2']
        })
        // API URL to create or update an item. `:id` contains whatever your
        // unique identifier is (if that's two columns, you'll need to handle
        // it seperately). For creating, `:id` is replaced with the word
        // `:create`.
        .update('/my/url/:id/')
        ;

## Managers
A core concept in a Monad admin is the `Manager`. A "manager" is like a super
object handling all module-specific retreiving and storing of data. You can
think of it as an interface between Monad and whatever backend you're using.

ECMAScript lacks interfaces, but Monad assumes a manager adheres to the
following specifications:

    class Manager {
    
        list(...params) {
            // Returns array of Models
        }

        find(...params) {
            // Returns promise yielding Models found using params (usually
            // taken from $routeParams)
        }

        create(item) {
            // Create item (which is a Model), return promise.
        }

        update(item) {
            // Update existing item Model, return promise.
        }

        delete(item) {
            // Delete existing item Model, return promise.
        }

Which params you need to supply is dependant on your API and preferences. The
default Manager in Monad offers `list` and `find` methods that simply accept a
URL, call it using `$http.get` and transform the response using the `model`
property on the Manager (which itself defaults to the base Model).

So, the following is a common pattern:

    "use strict";

    import {Manager as Base} from '/path/to/monad/src/services/Manager';
    // Assuming we require a custom Model:
    import {Model} from './Model';

    class Manager extends Base {

        constructor(...args) {
            // Calling `super()` is required, even if the constructor doesn't do
            // anything. If we don't, other methods won't have access to
            // `super` either.
            super(...args);
            this.model = Model;
        }

        list(param1, param2, param3) {
            // However you build your url...
            let url = `/some/${param1}/path/${param2}/with/${param3}/params/`;
            return super.list(url);
        }

        find(param4) {
            // Again, whatever...
            let url = `/somewhere/${param4}/else/`;
            return super.find(url);
        }

        // Implement create, update, delete as required.

    }

## Models
Each 'entity' of data in a module is generally represented by a 'model'. Monad
offers a base model class with some dirty checking and other goodies you can use
directly or extend for your own custom functionality. To simplify things, you
can see a model object as a representation of a single database row.

> Of course, we don't care if you get your data from a relational database,
> a NoSQL database, an Excel file, flat JSON or a random Google query. The
> point is, each 'item' is represented by a single model.

The model itself is _not_ an object in the Angular-sense; it is pure EcmaScript.
Apart from advantages over Angular (services are singletons, whereas models by
definition aren't) this also forces you to keep any logic out of the models.
They are data containers and should not be concerned with any `$http`-like
operations or any other external service.

> In rare cases, of course, this might be necassary. That's fine; either just
> write vanilla Javascript, or update your manager to handle it.

## Manually transforming the `$http` response
This is really something Angular-y, so outside of the scope of this
documentation. But, take a peek in `./services/Manager.js` to see how Monad
handles it internally.

## Controllers
In most cases, you'll be fine with Monad's default controllers for List and Crud
(Create or Update, Delete usually doesn't warrant a separate controller). But in
some cases (manipulating an item with a number of linked managers/models is a
common example) you'll want to roll your own. It's easiest to simply extend one
of the existing controllers and override what you need to (usually the
`update` method):

    import {CrudController} from '/path/to/monad/src/controllers/CrudController`;

    class MyController extends CrudController {

        update() {
            // Custom update logic
        }

    }

Note that both the `CrudController` as well as the `ListController`
automagically register all passed resolves whose names do not begin with `$`
(since that's kind of an internal Angular-thing) on `this`, and are thus
available both in the controller as in the view template.

Finally, during component definition instruct Monad to use the custom
controller for this action:

    import {MyController} from '/path/to/MyController';

    monad.component('foobar', 'foo')
        .update('/my/url/:id/', {controller: MyController});

In the same vein you can also override stuff like `templateUrl` if the default
doesn't suffice (e.g. you need to show a gallery of images instead of table with
text).

## Templates

### Lists
Monad provides a default table-based list in `./dist/templates/list.html`. In
certain cases you'll need to roll your own, which is easy. Pass a `templateUrl`
option to the `list` method with the path to your HTML file (relative from your
admin location of course). The default list template looks like this:

<div class="container-fluid" mo-list module="{{list.module}}" columns="list.columns" path="{{list.path}}">
    <mo-list-header create="{{list.create(monad.language)}}"></mo-list-header>
    <mo-list-table rows="list.items" page="list.page"></mo-list-table>
    <div class="text-center" ng-if="list.Manager.count > 10">
        <pagination total-items="list.Manager.count" ng-model="list.page" boundary-links="true" max-size="10"></pagination>
    </div>
</div>

The `moList` directive makes it a list. `moListHeader` generates the header with
optional create link, or you can add your own (the directive is transcluded).
`moListTable` is the default table, and below that is default pagination.

> Note that `moListHeader` and `moListTable` "require" `moList` on a parent.

### Schemas
Last but not least, Monad needs to know how you want to go about editing your
model (the library, alas, is not clairvoyant). By default, the update and create
actions (note that create is the same as update, only with the word `create`
instead of an actual identifier) look for a `schema.html` template in your
component's directory.

> Of course, you're free to override this using a custom `templateUrl` option,
> for instance when you have multiple object types with the same schema. It
> happens.

The HTML is stock Bootstrap mixed with some Monad directives. Here's simple
example:

    <mo-update on-save="crud.save()" on-delete="crud.delete()" item="crud.item" module="foo" list="/:language/foo/">
        <fieldset class="col-md-12">
            <legend>{{'monad.data' | translate}}</legend>
            <mo-field label="'foo.id' | translate">
                <input type="text" ng-model="crud.item.id" disabled>
            </mo-field>
            <mo-field label="'foo.title' | translate">
                <input type="text" ng-model="crud.item.title">
            </mo-field>
            <mo-field label="'foo.slug' | translate">
                <input type="text" ng-model="crud.item.slug" mo-slug="crud.item.title">
            </mo-field>
            <mo-field label="'foo.description' | translate">
                <textarea ckeditor="{language: monad.language}" ng-model="crud.item.description"></textarea>
            </mo-field>
        </fieldset>
    </mo-update>

The `onSave` and `onDelete` calls must be passed to the `moUpdate` directive.
This directive is transcluded, and adds headers and footers and stuff for you.
(It contains no other functionality, so don't feel obliged to use it.) The
`moField` directive automatically wraps a field with a label and sets required
Bootstrap classes. `moSlug` defines a field to 'listen to' which automatically
gets update with a valid URL slug. Finally, this includes an example of a
CKEditor textarea.

## Custom directives, filters and other stuff
Go wild, define and use whatever you need.

