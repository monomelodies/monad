
"use strict";

let paths = {};
let loc = undefined;
let auth = undefined;
let cache = {};

class Menu {
}

export default class Navigation {

    constructor($location, Authentication, $injector, gettextCatalog) {

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
                            if (component._texts && component._texts.$menu) {
                                path.label = gettextCatalog.getString(component._texts.$menu);
                            }
                            cache[menu].push(path);
                            if ('$manager' in component) {
                                let manager = $injector.get(component.$manager.name);
                                path.notifications = manager.notify;
                            }
                        }
                    } else {
                        // Submenu.
                        let sub = {label: gettextCatalog.getString(path.label), items: []};
                        path.items.map(item => {
                            let component = monad.component(item.component);
                            if (access(component)) {
                                if (component._texts && component._texts.$menu) {
                                    item.label = gettextCatalog.getString(component._texts.$menu);
                                }
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

    clear() {
        cache = {};
    }

    current() {
        for (let path in paths) {
            paths[path].map(item => item.selected = item.url != '/' && ('#' + loc.path()).indexOf(item.url) != -1);
        }
    }

    select(item = {}) {
        for (let path in paths) {
            paths[path].map(item => item.selected = false);
        }
        item.selected = true;
    }

}

Navigation.$inject = ['$location', 'Authentication', '$injector', 'gettextCatalog'];

