
"use strict";

let paths = {};
let loc;
let auth;

class Menu {
}

class Navigation {

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
                let items = [];
                paths[menu].map(path => {
                    if (path.url == '/') {
                        items.push(path);
                        return;
                    }
                    if (path.component) {
                        let component = monad.component(path.component);
                        if (access(component)) {
                            items.push(path);
                            if ('$manager' in component) {
                                let manager = $injector.get(component.$manager.name);
                                path.notifications = manager.notify;
                            }
                        }
                    } else {
                        // Submenu.
                        let sub = {label: path.label, items: []};
                        path.items.map(item => {
                            let component = monad.component(item.component);
                            if (access(component)) {
                                sub.items.push(item);
                            }
                        });
                        if (sub.items.length) {
                            items.push(sub);
                        }
                    }
                });
                return items;
            }});
        }
    }

    static register(component, menu, url, label) {
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
        let next = {component, url, label, selected};
        paths[menu].map(item => {
            if (item.label == sub) {
                item.items.push(next);
                found = true;
            }
        });
        if (!found && sub) {
            let subitem = new Menu;
            subitem.label = sub;
            subitem.items = [next];
            paths[menu].push(subitem);
        } else {
            paths[menu].push(next);
        }
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

Navigation.$inject = ['$location', 'Authentication', '$injector'];

export {Navigation};

