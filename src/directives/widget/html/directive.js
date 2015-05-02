
"use strict";

import {Widget} from './Widget';

class Html extends Widget {

    templateUrl(elem, attr) {
        return 'monad/src/Data/html.html';
    }

};

export {Html};

