
export default () => {
    return {
        restrict: 'E',
        template: `<div class="form-group">
    <label>{{label}}</label>
    <span ng-transclude></span>
</div>`,
        link: (scope, elem, attrs) => {
            elem.find('input, textarea, select').addClass('form-control');
        },
        scope: {label: '='},
        transclude: true
    };
};

