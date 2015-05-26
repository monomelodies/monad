
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

function link($scope, elem, attrs) {
    elem.attr('draggable', 'true');
    elem.attr('ondrop', '');
    elem.bind('dragstart', event => {
        target = $scope.item;
        if (event.originalEvent) {
            event.originalEvent.dataTransfer.effectAllowed = 'move';
            event.originalEvent.dataTransfer.setData('json/custom-object', $scope.item);
        }
    });
    elem.bind('dragenter', event => {
        elem.addClass('over');
    });
    elem.bind('dragover', event => {
        if (event.originalEvent && event.originalEvent.preventDefault) {
            event.originalEvent.preventDefault();
        }
        if (event.originalEvent) {
            event.originalEvent.dataTransfer.dropEffect = 'move';
        }
        return false;
    });
    elem.bind('dragleave', event => {
        elem.removeClass('over');
    });
    elem.bind('drop', event => {
        if (event.originalEvent && event.originalEvent.stopPropagation) {
            event.originalEvent.stopPropagation();
        }
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
    elem.bind('dragend', event => {
        elem.parent().find('.over').removeClass('over');
    });
}

