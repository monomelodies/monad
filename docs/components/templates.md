# Templates

## Lists
Lists are assumed to live in `/componentname/list.html`. Monad provides some
directives to make rendering a list easy:

```html
<div class="container-fluid" mo-list="list.component">
    <mo-list-header></mo-list-header>
    <mo-list-table rows="list.items" templates="{}">
        <table><tr>
            <th property="id">ID</th>
            <th property="some_field">Some field's label</th>
            <th property="some_other_field">Another label</th>
        </tr></table>
    </mo-list-table>
    <div class="text-center" ng-if="list.Manager.count > 10">
        <pagination total-items="list.Manager.count" ng-model="list.page" boundary-links="true" max-size="10"></pagination>
    </div>
</div>
```

> You can use the `templateUrl` option when registering the component to
> specify an override to this if you need one.

On the outer element of your list (in Bootstrap-based themes, usually a `<div>`
with `class="container-fluid"`, but feel free to go wild) define the `mo-list`
directive passing in the current component (stored under `list.component`).

The `<mo-list-header>` directive shows a default header. This includes a link to
the Create page if this component defined one. The directive uses transclusion;
whatever you put inside will be injected into your header. If you don't specify
a title explicitly, Monad will use a default ("items in {component}").

`<mo-list-table>` is the actual table of items. The attributes `rows` takes an
expression returning the list of items to show (generally just `list.items`).
The optional `templates` attribute is an expression yielding a hash of columns
and template URLS for custom rendering (the default is to just show a link to
the update page with the field's contents -- you might want that to be a
thumbnail or something).

This directive too uses transclusion, but differently: inside, specify your
table headers. This is used to customise what the list shows (since API's
generally return _all_ data on a row, and you probably don't need to show all of
that in your list view).

> Note that `moListHeader` and `moListTable` "require" `moList` on a parent.

The optional pagination section is just the Bootstrap paginator.

Of course, if your list action does something completely different, you're free
to not use these directives. The term "list" was chosen because that's the most
common action from a top-level menu link in an administrator, but if you instead
need to provide a custom view with, say, usage statistics, be our guest.

> Custom views/controllers _do_ need to call the `list` method on your
> component however for the URL to show up in the menu, even if the view isn't
> actually a "list" in technical terms.

## Schemas
Monad also needs to know how you want to deal with creating or updating your
model (the library, alas, is not clairvoyant). By default, the update and create
actions (note that create is the same as update, only with an empty model
passed) look for a `schema.html` template in your component's directory.

> Of course, you're free to override this using a custom `templateUrl` option,
> for instance when you have multiple object types with the same schema. It
> happens.

The HTML is stock Bootstrap mixed with some Monad directives. Here's simple
example:

```html
<mo-update>
    <div class="col-md-12"><fieldset role="core">
        <legend>This is my data</legend>
        <mo-field>
            <label>The label for ID</label>
            <input type="text" ng-model="crud.item.id" disabled>
        </mo-field>
        <mo-field>
            <label>The label for title</label>
            <input type="text" ng-model="crud.item.title">
        </mo-field>
        <mo-field>
            <label>The label for slug</label>
            <input type="text" ng-model="crud.item.slug" mo-slug="crud.item.title">
        </mo-field>
        <mo-field>
            <label>The label for description</label>
            <textarea ckeditor="options" ng-model="crud.item.description"></textarea>
        </mo-field>
    </fieldset></div>
</mo-update>
```

The `moUpdate` directive supports a few custom arguments, but we supply sane
defaults so you usually don't need to change them.

The `moField` directive automatically sets some required Bootstrap classes.
This is a very simple directive that you don't _need_ to use, but it's
convenient for Bootstrap-based themes.

`moSlug` defines a field to 'listen to' which automatically gets updated with a
valid URL slug. It's value is the model to listen to.

Finally, this includes an example of a CKEditor textarea. The `options`
expression is any valid object with CKEditor options (see their documentation
for possible values).

> You'll need a CKEditor Angular plugin to use WYSIWYG editing. See
> [the section on CKEditor in "Examples"](../samples/ckeditor.md) for more info.

For fields that are read-only, simply add the `disabled` attribute. You could
also not output it as a field but as simple text:

```html
<mo-field>{{ crud.item.readonly_field }}</mo-field>
```

In fact, you can put whatever you want inside `moField` as long as it's valid
HTML. You can also group related fields etc.

