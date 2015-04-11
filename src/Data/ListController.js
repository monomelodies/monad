
"use strict";

let route;
let injector;

class ListController {

    constructor(app, Module, $routeParams, $route, $injector) {
        this.app = app;
        route = $route;
        injector = $injector;
        var elements = Module.retrieve(app);
        for (let name in elements) {
            this[name] = elements[name];
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

ListController.$inject = ['app', 'Module', '$routeParams', '$route', '$injector'];

export {ListController};

