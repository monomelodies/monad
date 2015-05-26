# CrudController
Default controller to handle create, update and delete actions for Models. In
9 out of 10 cases (at the least), these resolve to a call to
`Manager.save(item)` with optionally `$mapping` maps also firing. This can all
be handled from the `resolve` parameter.

In cases where you need really fine-grained control, you can extend the
`CrudController`.

## Usage
```javascript
import {CrudController} from '/path/to/monad/src/controllers/CrudController';

class CustomCrudController extends CrudController {
    // ...custom stuff
}
```

## API

- #### save() ####

    Save all data (if dirty) according to the defined `$mapping`. Mapping
    defaults to `{item: 'Manager'}` which is good enough for simple CRUD
    operations.

- #### delete() ####

    Delete an item. By default, this shows an OMGWTFBBQ-are-you-sure dialog
    before actually deleting something.

