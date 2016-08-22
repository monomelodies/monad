
"use strict";

let paths = {};
let loc = undefined;
let auth = undefined;
let cache = {};

let defaults = {
    menu: 'main',
    authentication: undefined,
    notify: () => {}
};

class Menu {
}

/**
 * Service to handle navigatable menus in Monad.
 */
export default class Navigation {

    /**
     * Class constructor.
     *
     * @param object $location Injected $location service.
     * @param object Authentication Injected default Authentication service.
     * @return void
     */
    constructor($location, Authentication) {
        defaults.authentication = Authentication;
        loc = $location;
    }

    /**
     * Register an option on a menu.
     *
     * The following keys are recognised:
     * - (string) `title`: Human-readable option name. Run through
     *   `angular-gettext` when creating a multi-language admin.
     * - (string) `menu`: The menu to append this option to. Defaults to `main`
     *   which is the main top menu. You can add other menus if you like.
     * - (string) `parent`: Optional (possibly translated) title of parent item
     *   to add option to. Allows you to build submenus (pulldown). Note that
     *   menu titles are assumed to be unique within a (sub)menu.
     * - (string) `url`: The URL the menu option refers to. The language gets
     *   prepended by Monad.
     * - (string) `authentication`: Custom authentication service for this
     *   option. Defaults to the main authentication service, but you can
     *   override to restrict access to certain sections.
     * - (function) `notify`: A function that returns an integer alerting the
     *   user to activity or todos in this menu item.
     *
     * @param object option Key/value hash of settings for this option.
     * @return self for easy chaining (`moNavigation.option().option()`).
     */
    option(option = {}) {
        option = angular.extend({}, defaults, option);
        if (!('title' in option)) {
            throw 'Each menu option needs a (unique) title.';
        }
        paths[option.menu] = paths[option.menu] || [];
        let work = paths[option.menu];
        if (!this.hasOwnProperty(option.menu)) {
            Object.defineProperty(this, option.menu, {get: () => {
                return paths[option.menu];
            }});
        }
        if ('parent' in option) {
            let found = undefined;
            paths[option.menu].map(item => {
                if (item.title == option['parent']) {
                    found = item;
                }
            });
            if (!found) {
                found = {
                    title: option['parent'],
                    items: []
                };
                paths[option.menu].push(found);
                work = found.items;
            } else {
                found.items = found.items || [];
                work = found.items;
            }
        }
        if (!('url' in option)) {
            throw 'Each menu option needs to specify a URL.';
        }
        work.push(option);
        return this;
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

Navigation.$inject = ['$location', 'Authentication'];

