
"use strict";

import {Controller} from './Controller';

function ngConfig($stateProvider)
{
    $stateProvider.
        state('home', {
            url: '/',
            controller: Controller,
            controllerAs: 'home',
            templateUrl: './Home/view.html'
        });
}

export {ngConfig, Controller};

