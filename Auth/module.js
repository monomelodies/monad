
"use strict";

import {Controller} from './Controller';

function ngConfig($stateProvider)
{
    $stateProvider.
        state('login', {
            url: '/login/',
            controller: Controller,
            controllerAs: 'login',
            templateUrl: './Login/view.html'
        });
}

export {ngConfig, Controller};

