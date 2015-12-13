
"use strict";

let draggedElement;
let target;

export default () => {
    return {
        restrict: 'A',
        scope: {item: '=moDragDrop', list: '=', track: '@', position: '@'},
        link
    };
};

function prevent(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }
};

function link($scope, elem, attrs) {
    elem.attr('draggable', 'true');
    elem.bind('dragstart', event => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('json/custom-object', $scope.item);
        target = $scope.item;
    });
    elem.bind('dragenter', event => {
        prevent(event);
        elem.addClass('over');
        if (target != $scope.item) {
            $scope.$apply(() => {
                let idxsource = $scope.list.indexOf(target);
                let idxtarget = $scope.list.indexOf($scope.item);

                if ($scope.track) {
                    $scope.track.split(/[^\w]+/g).map(track => $scope.list[idxsource][track] = $scope.list[idxtarget][track]);
                }
                let tmp = $scope.list.splice(idxsource, 1);
                $scope.list.splice(idxtarget, 0, ...tmp);

                let attr = attrs.position;
                if (attr) {
                    $scope.list.map((item, idx) => {
                        item[attr] = idx;
                    });
                }
            });
                
        }
        return false;
    });
    elem.bind('dragover', event => {
        prevent(event);
        return false;
    });
    elem.bind('dragleave', event => {
        prevent(event);
        elem.removeClass('over');
        return false;
    });
    elem.bind('drop', event => {
        prevent(event);
        angular.element(elem.parent()[0].querySelectorAll('.over')).removeClass('over');
        return false;
    });
    elem.bind('dragend', event => {
        angular.element(elem.parent()[0].querySelectorAll('.over')).removeClass('over');
        return false;
    });
}

