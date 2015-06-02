
"use strict";

let paths = {};
let loc;
let auth;

class Navigation {

    constructor($location, Authentication) {
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
                    let authenticate = component.Authentication || auth;
                    if (authenticate && authenticate.check) {
                        items.push(path);
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

Navigation.$inject = ['$location', 'Authentication'];

export {Navigation};

