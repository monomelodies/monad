# Model
A data object with dirty checking and optional virtual members or other
additional logic.

## Usage
If your data contains nothing fancy, you can just use the Monad default model
which is automatically used by the base Manager. Default `list` will return a
[`Collection`](collection.md5) of models, `find` a single `Model`.

When custom functionality is needed, simply extend the base class:

```javascript
import {Model as Base} from '/path/to/monad/src/classes/Model';

class Model extends Base {

    get foobar() {
        // Assuming the manager had returned {foo: 1, bar: 2} or something...
        return this.foo + ' ' + this.bar;
    }

};
```

## API

- #### $new ####

    Virtual read-only property; `true` if the model is a new instance (hence
    should be "create"d on saving), `false` if it is existing data.

- #### $dirty ####

    Virtual read-only property; `true` if the model is "dirty", i.e. data was
    changed after initialisation and needs to be saved. `false` otherwise.

- #### $deleted ####

    Boolean marking the model as "deleted" or not. Should affect saving
    ("delete" instead of "save"). Default [Manager](../services/manager.md)
    handles this correctly.

- #### $export(void) ####

    Export data for this instance as a JSON object ready for storage. Also
    converts any `Date` object back to a flat string.

