
"use strict";

let current = undefined;
let scope = undefined;
let catalog = undefined;

/**
 * Service handling Monad interface languages.
 */
export default class Language {

    /**
     * Class constructor.
     *
     * @param object gettextCatalog Catalog service so a language change sets
     *  the new language.
     * @param object $rootScope Injector $rootScope.
     * @return void
     */
    constructor(gettextCatalog, $rootScope) {
        scope = $rootScope;
        catalog = gettextCatalog;
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (target.params.language && target.params.language != current) {
                this.current = target.params.language;
            }
        });
    }

    /**
     * Virtual property returning the current language.
     *
     * @return string Current language identifier.
     */
    get current() {
        return current;
    }

    /**
     * Virtual setter for the current language. The new language must be
     * available to the application.
     *
     * @param string lang The language identifier to set.
     * @return void
     */
    set current(lang) {
        if (scope.languages.indexOf(lang) == -1) {
            throw `Language "${lang}" is unavailable, sorry.`;
        }
        current = lang;
        catalog.setCurrentLanguage(current);
    }

    /**
     * Virtual property getting the list of defined languages.
     *
     * @return array Array of languages available to this application.
     */
    get list() {
        return scope.languages;
    }

};

Language.$inject = ['gettextCatalog', '$rootScope'];

