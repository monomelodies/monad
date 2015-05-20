## Lists
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

## Schemas
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
                <textarea ckeditor="monad.ckeditor()" ng-model="crud.item.description"></textarea>
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

## Configuring CKEditor
"What's that call to `monad.ckeditor`", I can almost hear you ask. Well, feel
free _not_ to use it, but it contains the defaults (language etc.). You can pass
an optional object as an argument containing overrides. You can set project-wide
defaults as an Angular `value` with the name `ckeditor`.

