# moDragDrop
Directive specifying HTML drag can be used to re-order items.

This directive is not meant to implement a complicated drag and drop where for
instance the user can move HTML elements from one container to another. It is
specifically intended to simplify reordering.

## Usage
```html
<div ng-repeat="item in items">
    <span mo-drag-drop="item" list="items" position="property" track="other properties">{{item.someOtherProperty}}</span>
</div>
```

## API

- #### mo-drag-drop ####

    Object containing the model to be dragged.

- #### list ####

    Required. Collection or array of all draggable items in this set.

- #### position ####

    Optional. Expression evaluating to the property name used to define the
    position. Dropping an element changes the order in the original Collection
    or array; however, your backend might look to a certain value to specify
    ordering.

    Note that this property will be zero-indexed.

- #### track ####

    Optional. Expression evaluating to a string listing other properties that
    should be copied from the element dropped on.

