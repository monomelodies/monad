
"use strict";

let route;
let injector;

class ListController {

    constructor(Module, Model, Service, $routeParams, $route, $injector) {
        console.log(Service);
        route = $route;
        injector = $injector;
        this.Model = Model;
        this.Service = Service;
        for (let key in Module) {
            this[key] = Module[key];
        }
        var setup = {};
        this.Meta.fieldsets.map(fieldset => {
            if (fieldset.primary) {
                fieldset.fields.map(field => setup[field] = undefined);
            }
        });
        this.Model.$load(setup);
        this.items = [];
        this.page($routeParams);
    }

    page(params) {
        while (this.items.length) {
            this.items.pop();
        }
        this.Service.list(params).success(items => items.map(item => this.items.push(injector.instantiate(this.Meta).$load(item, false))));
    }

    create() {
        this.Meta.$create(this.Model).success(() => {
            this.form = false;
            route.reload();
        });
    }

    reset() {
        this.Model.$load({});
    }
};

ListController.$inject = ['Module', 'Model', 'Service', '$routeParams', '$route', '$injector'];

export {ListController};

