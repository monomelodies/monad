
"use strict";

import {Widget} from './Widget';

class Textarea extends Widget {

    templateUrl(elem, attr) {
        return 'monad/src/directives/widget/textarea/template.html';
    }

};

export default () => new Textarea();

