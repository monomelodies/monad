
"use strict";

import {Module} from '../Module';

class Fieldset {

    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
    }

    templateUrl(elem, attr) {
        return 'monad/src/Data/fieldset.html';
    }

    static factory() {
        Fieldset.instance = new Fieldset();
        return Fieldset.instance;
    }
};

export {Fieldset};

