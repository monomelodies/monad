
"use strict";

let paths = {};
let loc = undefined;
let auth = undefined;
let cache = {};

class Menu {
}

/**
 * Mostly internally used service to handle navigatable menus in Monad.
 */
export default class Navigation {

    /**
     * Class constructor.
     *
     * @param object $location Injected $location object.
     * @param object Authentication Injected Authentication object.
     * @param object $injector Injector $injector object.
     * @return void
     */
    constructor($location, Authentication, $injector) {

        function access(component) {
            let authenticate;
            if (component.defaults.list
                && component.defaults.list.resolve
                && component.defaults.list.resolve.Authentication
            ) {
                authenticate = $injector.instantiate(component.defaults.list.resolve.Authentication);
            } else {
                authenticate = Authentication;
            }
            if (authenticate && authenticate.check) {
                return true;
            } else {
                return false;
            }
        };

        loc = $location;
        auth = Authentication;
        for (let menu in paths) {
            Object.defineProperty(this, menu, {get: () => {
                if (menu in cache) {
                    return cache[menu];
                }
                cache[menu] = [];
                paths[menu].map(path => {
                    if (path.component) {
                        let component = monad.component(path.component);
                        if (access(component)) {
                            cache[menu].push(path);
                            if ('$manager' in component) {
                                path.manager = $injector.get(component.$manager.name);
                            }
                        }
                    } else {
                        // Submenu.
                        let sub = {items: []};
                        path.items.map(item => {
                            let component = monad.component(item.component);
                            if (access(component)) {
                                sub.items.push(item);
                            }
                        });
                        if (sub.items.length) {
                            cache[menu].push(sub);
                        }
                    }
                });
                return cache[menu];
            }});
        }
    }

    /**
     * Static method to register an option on a menu.
     *
     * @param Component component The Monad Component to register.
     * @param string menu The menu to register on.
     * @param string url The URL this option should link to.
     * @param string label Optional label to register under; used for building
     *  menus-with-submenus.
     * @return void
     */
    static register(component, menu, url, label = undefined) {
        let work;
        if (typeof menu == 'string') {
            let m = {};
            m[menu] = null;
            menu = m;
        }
        let sub;
        for (let key in menu) {
            sub = menu[key];
            menu = key;
        }
        paths[menu] = paths[menu] || [];
        let selected = false;
        let found = false;
        if (!label) {
            label = this.name;
        }
        let next = {component, url, label, selected};
        paths[menu].map(item => {
            if (item.label && item.label == sub) {
                item.items.push(next);
                found = true;
            }
        });
        if (!found) {
            if (sub) {
                let subitem = new Menu;
                subitem.label = sub;
                subitem.items = [next];
                paths[menu].push(subitem);
            } else {
                paths[menu].push(next);
            }
        }
    }

    /**
     * Clears the menu cache. Sometimes useful to reset stuff.
     *
     * @return void
     */
    clear() {
        cache = {};
    }

    /**
     * Try to set "selected" status according to the current location.
     *
     * @return void
     */
    current() {
        for (let path in paths) {
            paths[path].map(item => item.selected = item.url != '/' && ('#' + loc.path()).indexOf(item.url) != -1);
        }
    }

    /**
     * Select the specified item.
     *
     * @param object item Optional item to select. If none is passed, nothing is
     *  selected.
     * @return void
     */
    select(item = {}) {
        for (let path in paths) {
            paths[path].map(item => item.selected = false);
        }
        item.selected = true;
    }

}

Navigation.$inject = ['$location', 'Authentication', '$injector'];

