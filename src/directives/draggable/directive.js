
"use strict";

let draggedElement;
let target;

export default () => {
    return {
        restrict: 'A',
        scope: {item: '=moDraggable', list: '='},
        link
    }

    function link($scope, elem, attrs) {
        elem.attr('draggable', 'true');
        elem.bind('dragstart', event => {
            target = $scope.item;
            event.originalEvent.dataTransfer.effectAllowed = 'move';
            event.originalEvent.dataTransfer.setData('json/custom-object', $scope.item);
        });
        elem.bind('dragenter', enter => {
            elem.addClass('over');
        });
        elem.bind('dragover', event => {
            if (event.originalEvent.preventDefault) {
                event.originalEvent.preventDefault();
            }
            event.originalEvent.dataTransfer.dropEffect = 'move';
            return false;
        });
        elem.bind('dragleave', event => {
            elem.removeClass('over');
        });
        elem.bind('drop', event => {
            if (event.originalEvent.stopPropagation()) {
                event.originalEvent.stopPropagation();
            }
            if (target != $scope.item) {
                $scope.$apply(() => {
                    let idxsource = $scope.list.indexOf(target);
                    let idxtarget = $scope.list.indexOf($scope.item);
                    let attr = attrs.sort;
                    /*
                    if (this.$dragConfig.track) {
                        (angular.isArray(this.$dragConfig.track) ? this.$dragConfig.track : [this.$dragConfig.track]).map(track => {
                            Drag.instance.items[idxsource][track] = Drag.instance.items[idxtarget][track];
                        });
                    }
                    */
                    $scope.list.splice(idxtarget, 0, $scope.list.splice(idxsource, 1).shift());
                    $scope.list.map((item, idx) => {
                        item[attr] = idx;
                    });
                });
                    
            }
            return false;
        });
        elem.bind('dragend', event => {
            elem.parent().find('.over').removeClass('over');
        });
    }

};

