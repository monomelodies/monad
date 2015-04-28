
"use strict";

class Widget {

    constructor() {
        this.restrict = 'E';
        this.transclude = true;
        this.controllerAs = 'widget';
        this.bindToController = true;
    }

    get controller() {
        return ['$attrs', '$scope', ($attrs, $scope) => {
            this.model = $scope.$eval($attrs.model);
            $scope.app = $scope.$parent.data.app;
            $scope.model = $scope.$parent.data.model;
        }];
    }

};

export {Widget};

