
export default () => {
    return {
        restrict: 'E',
        template: '<div class="form-group"><div ng-transclude></div></div>',
        link: (scope, elem, attrs) => {
            angular.element(elem[0].querySelectorAll('input, textarea, select')).addClass('form-control');
        },
        scope: {},
        transclude: true
    };
};

