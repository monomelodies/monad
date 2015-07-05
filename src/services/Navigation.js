
"use strict";

let paths = {};
let loc;
let auth;

class Navigation {

    constructor($location, Authentication, $injector) {
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
                    let component = monad.component(path.component);
                    let authenticate;
                    if (component.defaults.list
                        && component.defaults.list.resolve
                        && component.defaults.list.resolve.Authentication
                    ) {
                        authenticate = $injector.instantiate(component.defaults.list.resolve.Authentication);
                    } else {
                        authenticate = auth;
                    }
                    if (authenticate && authenticate.check) {
                        items.push(path);
                        let manager = $injector.get(component.$manager.name);
                        path.notifications = manager.notify;
                    }
                });
                return items;
            }});
        }
    }

    static register(component, menu, url, label) {
        let selected = false;
        paths[menu] = paths[menu] || [];
        paths[menu].push({component, url, label, selected});
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

