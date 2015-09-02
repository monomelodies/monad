# moListTable
Directive to auto-generate a table of items in a collection.

## Usage
```html
<mo-list-table rows="rows" page="pageNumber">
    <table><tr>
        <th property="some_property">Some property heading</th>
    </tr></able>
</mo-list-table>
```

## API

- #### rows ####

    Required array or (preferably) [Collection](../../classes/collection.md) of
    rows to display on a page.

- #### page ####

    Object pointing to the current page number. The default
    [Manager](../../services/manager.md) has a `paginate` method that gets
    automatically called when using the default
    [ListController](../../controllers/list.md).

