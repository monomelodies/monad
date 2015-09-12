# moListTable
Directive to auto-generate a table of items in a collection.

## Usage
```html
<mo-list-table rows="rows" template="templates">
    <table><tr>
        <th property="some_property">Some property heading</th>
    </tr></able>
</mo-list-table>
```

The transcluded `<table>` should specify the header rows (and thus the fields to
actually show in the table). If omitted, all fields will be shown.

> You _must_ wrap the headers in a valid `<table>` element, or browsers will
> pull weird stuff when the directive gets inserted.

## API

- #### rows ####

    Required array or (preferably) `Collection` of rows to display on a page.

- #### template ####

    An object or expression evaluating to one specifying custom `templateUrl`s
    for one or more fields in the list. The default is to show the field's
    contents wrapped in a link to the update page, but you could e.g. specify
    a template that shows a thumbnail for an image URL.

