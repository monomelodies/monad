
"use strict";

import {Widget} from './Widget';

class Textarea extends Widget {

    templateUrl(elem, attr) {
        return 'monad/src/Data/textarea.html';
    }

};

export {Textarea};

