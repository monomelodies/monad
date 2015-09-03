
"use strict";

let current = undefined;
let langs = undefined;
let catalog = undefined;

export default class Language {

    constructor(languages, gettextCatalog, $rootScope) {
        langs = languages;
        catalog = gettextCatalog;
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (target.params.language && target.params.language != current) {
                this.current = target.params.language;
            }
        });
    }

    get current() {
        return current;
    }

    set current(lang) {
        if (langs.indexOf(lang) == -1) {
            throw `Language "${lang}" is unavailable, sorry.`;
        }
        current = lang;
        catalog.setCurrentLanguage(current);
        catalog.loadRemote('../monad/i18n/' + lang + '.json');
        catalog.loadRemote('i18n/' + lang + '.json');
    }

    get list() {
        return langs;
    }

};

Language.$inject = ['languages', 'gettextCatalog', '$rootScope'];

