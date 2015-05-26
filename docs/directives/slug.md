# moSlug
Directive marking a field (usually `type="text"` as a "slug", optionally
specifying a related `ngModel` to automatically update to.

## Usage
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

## API

- #### ngModel ####

    Dependency; this is the entry that gets "sluggified" on change.

- #### moSlug ####

    If set to another model, it will be automatically updated on change. The
    updates happen when either the model in `moSlug` is updated, or when the
    `ngModel` fires a `change` or `blur` event.

