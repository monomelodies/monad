
export default () => {
    return {
        restrict: 'E',
        template: `<div class="form-group">
    <label>{{label}}</label>
    <span ng-transclude></span>
</div>`,
        link: (scope, elem, attrs) => {
            scope.label = attrs.label;
            elem.find('input, textarea, select').addClass('form-control');
        },
        transclude: true
    };
};

