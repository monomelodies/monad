
"use strict";

import angular from 'angular';
import '../core/bootstrap';
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

