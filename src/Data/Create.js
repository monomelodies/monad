
"use strict";

let ngClick;

class Create {

    constructor(ngClickDirective) {
        this.restrict = 'A';
        ngClick = ngClickDirective;
    }

    click(scope, element, fn) {
        var attr = {ngClick: fn};
        ngClick[0].compile(element, attr)(scope, element, attr);
    }

    static factory(ngClickDirective) {
        return new Create(ngClickDirective);
    }

};

Create.factory.$inject = ['ngClickDirective'];

export {Create};

