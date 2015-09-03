# moListHeader
Generic header for lists (title, optional create button etc.).

## Usage
```html
<mo-list-header></mo-list-header>
```

## API
This is an empty directive wrapping the header template. A create link is
automatically shown if the Component supports creation. The directive's
contents are transcluded and can specify the title of the list; if not provided,
a default title is used.

