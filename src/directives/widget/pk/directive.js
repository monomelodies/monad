
"use strict";
 
import {Widget} from './Widget';

class Pk extends Widget {

    templateUrl(elem, attr) {
        return 'monad/src/directives/widget/pk/template.html';
    }

};

export default () => new Pk();

