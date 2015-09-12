# moPath
A helper directive for easy URL generation.

## Usage
```html
<a mo-path="MyController" arguments="object"></a>
<a mo-path="/some/link/" arguments="object"></a>
```

Normally, you'll use this to auto-inject parameters into paths, like the
application-wide `language` parameter or an item ID.

## Attributes
- #### mo-path ####
    Expression yielding the actual path identifier. Can be a name of a
    controller (note: must be registered in Angular!) or a path string.
- #### arguments ####
    Object hash with optional path parameters. The language parameter is
    injected automatically and defaults to `Language.current`.

