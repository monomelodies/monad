
"use strict";

import Model from '../Model';

/**
 * Simple factory function for new, empty models with attached resource.
 */
export default () => resource => {
    let empty = new Model;
    empty.$resource = resource;
    return empty;
};

