
"use strict";

let route;

class ListController {

    constructor(app, Module, $routeParams, $route) {
        this.app = app;
        route = $route;
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
        this.Service.list(params).success(items => this.items = items);
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

ListController.$inject = ['app', 'Module', '$routeParams', '$route'];

export {ListController};

