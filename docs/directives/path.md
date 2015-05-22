# Path
A helper directive for easy URL generation.

## Usage
```html
<a mo-path="MyController" arguments="{{expression}}"></a>
<a mo-path="/some/link/" arguments="{{expression}}"></a>
```

Normally, you'll use this to auto-inject the `language` parameter into paths,

## Attributes
- #### mo-path
    Expression yielding the actual path identifier. Can be a name of a
    controller (note: must be registered in Angular!) or a path string.
- #### arguments
    Expression yielding optional path parameters. The language parameter is
    injected automatically and defaults to
    [`Language.current`](../services/language.md).

