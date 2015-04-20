
"use strict";

let route;
let injector;

class Controller {

    constructor(Module, $routeParams, $route, $injector) {
        route = $route;
//        injector = $injector;
//        this.Model = Model;
//        this.Service = Service;
        for (let key in Module) {
            if (['Controller', 'Repository'].indexOf(key) != -1) {
                this[key] = $injector.instantiate(Module[key]);
            } else {
                this[key] = Module[key];
            }
        }
        var setup = {};
//        this.Meta.fieldsets.map(fieldset => {
//            if (fieldset.primary) {
//                fieldset.fields.map(field => setup[field] = undefined);
//            }
//        });
//        this.Model.$load(setup);
        this.items = [];
        this.page($routeParams);
    }

    page(params) {
        while (this.items.length) {
            this.items.pop();
        }
        this.Repository.list(params).success(items => items.map(item => this.items.push(item)));
    }

    create() {
//        this.Meta.$create(this.Model).success(() => {
            this.form = false;
            route.reload();
//        });
    }

//    reset() {
//        this.Model.$load({});
//    }
};

Controller.$inject = ['Module', '$routeParams', '$route', '$injector'];

export {Controller};

