# Template components and directives
Monad supplies a number of helpful components and directive you can utilise to
quickly make your template views do something useful. We already saw
`moListHeader`, `moListTable` and `moUpdate`. Here are the others:

## `moField`
Simple directive to wrap form elements in. It automatically adds Bootstrap
classes and markup.

```html
<mo-update ...params...>
    <mo-field>
        <label>This is the label</label>
        <input ng-model="$ctrl.data.item.property">
    </mo-field>
</mo-update>
```

You can place anything that needs to be wrapped in an `<moField>` directive. The
directive will automatically wrap it in a `<div class="form-group">` and add
Bootstrap's `form-control` class to any contained form elements.

## `moSlug`
Directive marking a field (usually `type="text"`) as a "slug", optionally
specifying a related `ngModel` to automatically update to.

```html
<input type="text" ng-model="slugModel" mo-slug="otherModel">
```

A "slug" is defined as:

> A _normalised_ string containing only lower case letters, numbers or hyphens,
> with a maximum of 255 characters. "Normalised" in this context means all
> diatribed characters are replaced with their non-diatribed equivalent. Hyphens
> may not be followed by other hyphens and are "concatenated" into one hyphen.
> Any other character - including Whitespace - is replaced by a hyphen. Hyphens
> are not allowed at the start or end of the string and are trimmed there.

E.g., if in the above example `otherModel` receives a value of `"Holy cow, this
is super-super handy!"` then `slugModel` would automatically become
`"holy-cow-this-is-super-duper-handy"`.

If no related model is defined the field is simply restricted to "allowed
characters".

## `moDragDrop`
Directive specifying HTML drag can be used to re-order items.

This directive is not meant to implement a complicated drag and drop where for
instance the user can move HTML elements from one container to another. It is
specifically intended to simplify reordering in a list (array) of items.

```html
<div ng-repeat="item in items">
    <span mo-drag-drop="item" list="items" position="property" track="other properties">{{item.someOtherProperty}}</span>
</div>
```

`mo-drag-drop` must be bound to the draggable item model. The `list` property
refers to the "master list" that is to be reordered. Optionally, you can specify
the `position` attribute. On reordering, the zero-indexed positions in the array
will be set to that property on the items. E.g., for `position="foo"` the
_second_ item in the list will get `item.foo = 1`. This also marks a model as
dirty. Finally, `track` can contain a space-separated string list of other
properties that need to be copied on re-order, if needed. If not defined, the
models will simply be spliced into a new array verbatim.

