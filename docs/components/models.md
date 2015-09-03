# Models
Each 'entity' of data in a module is generally represented by a 'model'. Monad
offers a base model class with some dirty checking and other goodies you can use
directly or extend for your own custom functionality. To simplify things, you
can see a model object as a representation of a single database row.

> Of course, we don't care if you get your data from a relational database,
> a NoSQL database, an Excel file, flat JSON or a random Google query. The
> point is, each 'item' is represented by a single model.

The model itself is _not_ an object in the Angular-sense; it is pure EcmaScript.
Apart from advantages over Angular (services are singletons, whereas models by
definition aren't) this also forces you to keep any logic out of the models.
They are data containers and should not be concerned with any `$http`-like
operations or any other external service. Interacting with the API is, after
all, the Manager's job.

> In rare cases, of course, this might be necassary. That's fine; either just
> write vanilla Javascript, or update your manager to handle it.

## Custom models
If you need to _extend_ the basic model functionality, by all means: just add a
custom class extending the base model:

```javascript
import Base from '/path/to/monad/src/classes/Model';

class Model extends Base {

    // We _must_ call super for inheritance to work in ECMAScript:
    constructor(...args) {
        super(...args);
    }

    // Assuming this particular model has a field 'foobar' that should
    // always return a concatenation of the fields 'foo' and 'bar':
    get foobar() {
        return this.foo + this.bar;
    }

}
```

The above is a trivial example, but you get the idea. Here `foobar` is
read-only; if you need to write too, simply add a corresponding `set` method.

> A real-world example of this could be a data source listing `firstname` and
> `lastname` fields, and a model defining a `fullname` virtual property.

