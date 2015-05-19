
"use strict";

let paths = {};
let loc;

class Navigation {

    constructor($location = undefined) {
        if ($location) {
            loc = $location;
        }
    }

    register(menu, url, label) {
        let selected = false;
        paths[menu] = paths[menu] || [];
        paths[menu].push({url, label, selected});
        if (!this.hasOwnProperty(menu)) {
            Object.defineProperty(this, menu, {get: () => paths[menu]});
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

    /**
     * Main menu is (virtually) always defined anyway.
     */
    get main() {
        return paths.main;
    }

}

Navigation.$inject = ['$location'];

export {Navigation};

