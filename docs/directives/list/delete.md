# moDelete
A directive to facilitate deletion straight from a list, including a
confirmation modal.

## Usage
Generally speaking, you'll want to specify this in the `template` attribute of
an [`moListTable`](table.md) directive:

```html
<div mo-list="list.module">
    <mo-list-table rows="list.items" template="{actions: '/path/to/template.html'}">
        <table><tr>
            <th property="actions">Actions</th>
        </tr></table>
    </mo-list-table>
</div>
```

...and in your template file simply add:
```html
<mo-delete></mo-delete>
```

(Of course, you might want to specify multiple actions here.)

## API
Sorry: that's all, folks :) The directive inherits the item to delete from its
parent scope.

