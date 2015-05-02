
"use strict";

import {Widget} from './Widget';

class Text extends Widget {

    templateUrl(elem, attr) {
        return 'monad/src/Data/text.html';
    }

};

export {Text};

