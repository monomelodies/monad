
"use strict";

class Fieldset {

    constructor() {
        this.restrict = 'A';
        this.scope = {app: '=', model: '=', legend: '=', adder: '='};
        this.legend = 'monad.data';
        this.controllerAs = 'fieldset';
        this.bindToController = true;
        this.transclude = true;
        this.templateUrl = 'monad/src/fieldset.html';
    }

    get controller() {
        return ['$scope', $scope => {}];
    }

};

export {Fieldset};

