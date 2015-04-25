
"use strict";

class Widget {

    constructor() {
        this.restrict = 'E';
        this.scope = {app: '=', model: '=', field: '='};
        this.transclude = true;
        this.controllerAs = 'widget';
        this.bindToController = true;
    }

    get controller() {
        return ['$scope', $scope => {}];
    }

};

export {Widget};

