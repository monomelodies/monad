
"use strict";

import {Widget} from './Widget';

class Textarea extends Widget {

    templateUrl(elem, attr) {
        return '../monad/directives/widget/textarea/template.html';
    }

};

export default () => new Textarea();

