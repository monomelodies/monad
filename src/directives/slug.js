
"use strict";

function makeSlug(str) {
    if (!str) {
        return str;
    }
    str = str.normalize('NFKD').replace(/[\u0300-\u036F]/g, "");
    str = str.toLowerCase().replace(/\s+/g, '-');
    str = str.replace(/[^a-z0-9-]+/g, '-');
    str = str.replace(/-{2,}/g, '-');
    str = str.replace(/^-/, '');
    str = str.replace(/-$/, '');
    return str;
};

export default () => {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {source: '=moSlug', target: '=ngModel'},
        link: (scope, elem, attrs, ctrl) => {
            scope.$watch('source', (newvalue, oldvalue) => {
                scope.target = makeSlug(newvalue);
            });
            ctrl.$parsers.unshift(value => {
                value = makeSlug(value);
                return value;
            });
            ctrl.$formatters.unshift(value => {
                ctrl.$setValidity('moSlug', true);
                value = makeSlug(value);
                return value;
            });
            elem.on('blur keyup change', () => scope.target = makeSlug(elem.value()));
        }
    };
};

