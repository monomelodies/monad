
"use strict";

let current;
let langs;
let translate;

class Language {

    constructor(languages, $translate, $rootScope) {
        langs = languages;
        translate = $translate;
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
        translate.use(current);
        translate.refresh();
    }

    get list() {
        return langs;
    }

};

Language.$inject = ['languages', '$translate', '$rootScope'];

export {Language};

