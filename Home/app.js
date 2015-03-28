
"use strict";

import {Monad} from '../Monad';
import {Controller} from './Controller';

Monad.config(['$stateProvider', function($stateProvider) {
    $stateProvider.
        state('home', {
            url: '/',
            controller: Controller,
            controllerAs: 'home',
            templateUrl: './Home/view.html'
        });
}]);

export { Controller };

