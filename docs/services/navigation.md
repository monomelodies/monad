# Navigation
Service managing menus needed in your admin application. The default template
`index.html` only supports a `main` menu at present.

## Usage
Normally entries will be added by `monad.component(...).list()` calls. If you
need fine-grained control, you can inject the service or its provider where
needed an use the API.

## API

- #### register(menu, url, label) ####

    Register a URL on the requested `menu` (a string) with the text `label`.
    Note that labels are assumed to be translatable placeholders.

    The value of `menu` is available as a property from thereon.

- #### current() ####

    Sets the selected property of each menu item to `false` (if it is not the
    currently selected item), else `true`. Generally, this would only match
    one in all items.

- #### select(item) ####

    Select the passed menu item.

