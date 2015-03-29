
"use strict";

import {Controller} from './Controller';

function ngConfig($stateProvider)
{
    $stateProvider.
        state('bla', {
            url: '/bla/',
            controller: Controller,
            controllerAs: 'home',
            templateUrl: './Home/view.html'
        });
}

export {ngConfig, Controller};

