# moField
Simple directive to wrap form elements in. It automatically adds Bootstrap
classes and markup.

## Usage
```html
<mo-update>
    <mo-field>
        <label>This is the label</label>
        <input ng-model="crud.item.property">
    </mo-field>
</mo-update>
```

## API
None; the directive's contents get transcluded verbatim.
    
