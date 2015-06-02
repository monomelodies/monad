# Navigation
Service managing menus needed in your admin application. The default template
`index.html` only supports a `main` menu at present.

The navigation service automatically adds getters for each menu, e.g.
`Navigation.main`, `Navigation.myCustomMenu` etc.

## Usage
Normally entries will be added by `monad.component(...).list()` calls. If you
need fine-grained control, you can inject the service or its provider where
needed and use the API.

## API

- #### static register(component, menu, url, label) ####

    Register a URL for `component` on `menu` with the text `label`. Note that
    labels are assumed to be translatable placeholders. Component and menu are
    passed as string (i.e., component name and menu ID, e.g. `main`).

    The value of `menu` is available as a property after construction (typically
    when when injecting as an AngularJS service).

- #### current() ####

    Sets the selected property of each menu item to `false` (if it is not the
    currently selected item), else `true`. Generally, this would only match
    one in all items.

- #### select(item) ####

    Select the passed menu item.

## Authentication

By default, the `Navigation` service uses a Component's `Authentication`
service to determine whether the current user has access (if not, the menu item
in question is skipped). If no component-specific authentication is supplied,
the global [`Authentication` service](authentication.md) is used.

