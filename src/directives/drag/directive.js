
"use strict";

let draggedElement;
let scope;

class Drag {

    constructor() {
        this.restrict = 'A';
        this.scope = {monadDrag: '='};
        this.items = undefined;
    }

    link($scope, elem, attrs, ngModelController) {
        scope = $scope;
        angular.element(elem).attr('draggable', 'true');
        elem.bind('dragstart', Drag.instance.start);
        elem.bind('dragenter', Drag.instance.enter);
        elem.bind('dragover', Drag.instance.over);
        elem.bind('dragleave', Drag.instance.leave);
        elem.bind('drop', Drag.instance.drop);
        elem.bind('dragend', Drag.instance.end);
        elem.get(0).$dragConfig = scope.monadDrag;
        if (!Drag.instance.items) {
            Drag.instance.items = scope.monadDrag.list;
        }
    }

    start(event) {
        draggedElement = this;
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData('json/custom-object', this.$dragConfig.item);
    }

    enter(event) {
        this.classList.add('over');
    }

    over(event) {
        if (event.originalEvent.preventDefault) {
            event.originalEvent.preventDefault();
        }
        event.originalEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    leave(event) {
        this.classList.remove('over');
    }

    drop(event) {
        if (event.originalEvent.stopPropagation()) {
            event.originalEvent.stopPropagation();
        }
        if (draggedElement != this) {
            scope.$apply(() => {
                let idxsource = Drag.instance.items.indexOf(draggedElement.$dragConfig.item);
                let idxtarget = Drag.instance.items.indexOf(this.$dragConfig.item);
                if (this.$dragConfig.track) {
                    (angular.isArray(this.$dragConfig.track) ? this.$dragConfig.track : [this.$dragConfig.track]).map(track => {
                        Drag.instance.items[idxsource][track] = Drag.instance.items[idxtarget][track];
                    });
                }
                Drag.instance.items.splice(idxtarget, 0, Drag.instance.items.splice(idxsource, 1).shift());
                Drag.instance.items.map((item, idx) => {
                    if (item.$order) {
                        item.$order(idx);
                    }
                });
            });
                
        }
        return false;
    }

    end(event) {
        [].forEach.call(this.parentNode.querySelectorAll('.over'), el => el.classList.remove('over'));
    }

    static factory() {
        Drag.instance = new Drag();
        return Drag.instance;
    }
};

export {Drag};

