# ListController
Default controller handling lists, that is Collections of Models.

## Usage
Generally, the default `ListController` from Monad is fine. If you really need
custom logic, you can simply extend it (or write your own, as long as it honours
the same interface):

```javascript
import {ListController} from '/path/to/monad/src/controllers/ListController';

class CustomListController extends ListController {

    // custom stuff...

}
```

## API

- #### page ####

    Virtual property to get or set the current page in the list. On change calls
    the `paginate` method of your Manager.

- #### delete(Model item) ####

    Delete (after confirmation!) this Model. This allows you to add delete links
    in a list for quick deletion.

