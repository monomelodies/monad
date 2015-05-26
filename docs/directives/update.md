# moUpdate
Wrapper directive for update (or create) `schema.html` templates.

## Usage
```html
<mo-update on-save="crud.save()" on-delete="crud.delete()" item="crud.item" module="crud.module">
    ...schema fields...
</mo-update>
```

This directive automatically add a header and footer to your schema, with
save/delete buttons as needed.

## API

- #### onSave ####

    Optional. Method to be called when the save button is clicked. Default value
    is `crud.save()`. Set to something falsy to disable saving.

- #### onDelete ####

    Optional. Method to be called when the delete button is clicked. Default
    value is `crud.delete()`. Set to somethig falsy to disable deleting.

- #### item ####

    Optional. The model being updated. Defaults to `crud.item`.

- #### module ####

    Optional. The current module loaded. Defaults to `crud.module`.

> The defaults listed above will suffice in most cases, unless you are going
> really wild with your controller overrides.

