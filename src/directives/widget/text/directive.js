
"use strict";

import {Widget} from './Widget';

class Text extends Widget {

    templateUrl(elem, attr) {
        return '../monad/Data/text.html';
    }

};

export {Text};

