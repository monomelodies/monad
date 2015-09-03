
export default () => {
    return {
        restrict: 'E',
        template: `<div class="form-group">
    <span ng-transclude></span>
</div>`,
        link: (scope, elem, attrs) => {
            elem.find('input, textarea, select').addClass('form-control');
        },
        scope: {},
        transclude: true
    };
};

