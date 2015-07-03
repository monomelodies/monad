# Quick inline editing in lists
Often, it can be handy to offer quick inline editing in lists. "Delete row" and
"copy row" are obvious examples, but one could also imagine a blog admin where
you can quickly mark entries as spam.

## Setting up inline edits
There's two things we need for this.

First, you must define an extra "virtual" column for every inline action you
require. As an example, let's offer `delete`:

```javascript
monad.component('foo')
    // manager...
    .list('/foo/', {columns: ['bar', 'baz', 'delete']});
```

Great, we now have an empty column (assuming the `foo` items don't already
have a property `delete`: this is up to you).

Next, we add a resolve key to the `list` call with the key `inlines`:

```javascript
monad.component('foo')
    // manager...
    .list('/foo/', {columns: ['bar', 'baz', 'delete']}, {inlines: ['fooManager', Manager => {
        'delete': {
            type: 'btn-danger',
            label: 'foo.delete',
            handle: item => {
                item.$deleted = true;
                return Manager.save(item);
            }
        }
    });
```

The resolved `inlines` object has keys that should correspond with the "virtual"
columns defined above. Each entry is itself an object with the following keys:

- `type` is the class used. You can use Bootstrap btn-classes, or define your
  own.
- `label` is the i18n-string used as a label for the button.
- `handle` is a function that takes on argument (the item) and should return a
  promise, generally `Manager.save()`.

`type` is optional and defaults to `btn-default`.

