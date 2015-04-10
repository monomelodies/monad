
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
                (angular.isArray(this.$dragConfig.track) ? this.$dragConfig.track : [this.$dragConfig.track]).map(track => {
                    let old = Drag.instance.items[idxsource][track];
                    Drag.instance.items[idxsource][track] = Drag.instance.items[idxtarget][track];
                    Drag.instance.items[idxtarget][track] = old;
                });
                Drag.instance.items.splice(idxtarget, 0, Drag.instance.items.splice(idxsource, 1).shift());
                /*
                let idx;
                let old;
                Drag.instance.items.map((elem, i) => {
                    if (elem == this.$dragConfig.item) {
                        idx = i;
                        old = elem[this.$dragConfig.track];
                        elem[this.$dragConfig.track] = draggedElement.$dragConfig.item[this.$dragConfig.track];
                        draggedElement.$dragConfig.item[this.$dragConfig.track] = old;
                    }
                    if (elem == draggedElement.$dragConfig.item) {
                        Drag.instance.items.splice(i, 1);
                    }
                });
                console.log(idx);
                Drag.instance.items.splice(idx, 0, draggedElement.$dragConfig.item);
                */
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

Drag.factory.$inject = ['$rootScope'];

export {Drag};

