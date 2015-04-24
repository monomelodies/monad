
"use strict";

import {Module} from '../Module';

class Fieldset {

    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.scope = {fieldset: '=', schema: '=', app: '=', model: '=', 'class': '=className'};
        this.transclude = true;
        this.templateUrl = 'monad/src/Data/fieldset.html';
        this.controllerAs = 'ctrl';
        this.controller = ['$scope', function($scope) {
            this.templateFor = field => {
                let t;
                this.schema.fields.map(f => {
                    if (f.key == field) {
                        t = f.widget;
                    }
                });
                return t;
            };
            this.editor = field => {
                let t;
                this.schema.fields.map(f => {
                    if (f.key == field) {
                        t = f.ckeditor;
                    }
                });
                return t;
            };
        }];
        this.bindToController = true;
    }

    static factory() {
        Fieldset.instance = new Fieldset();
        return Fieldset.instance;
    }
};

export {Fieldset};

