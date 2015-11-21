
"use strict";

let params = undefined;
let route = undefined;
let modal = undefined;

/**
 * Default "list" controller. Usually good enough if all you need is a
 * clickable list of items in a Component.
 */
export default class ListController {

    /**
     * Class constructor. Redirects to login if authentication for this
     * Component fails.
     *
     * @param object $scope Injected Angular $scope.
     * @param object $route Injected Angular $route service.
     * @param object $modal Injected Bootstrap $modal service.
     * @return void
     */
    constructor($scope, $route, $modal) {
        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        this.$new = new this.Manager.constructor.Model();
        params = angular.copy($route.current.params);
        delete params.language;
        modal = $modal;
        route = $route;

        if (this.defaultFilter) {
            this.filter = this.defaultFilter;
        }

        this.page = params.page || 1;

        if (!this.Authentication.check) {
            this.Authentication.missing();
        }

        $scope.$watch('list.filter', newvalue => {
            this.page = 1;
            this.Manager.filter = newvalue;
            delete this.Manager.$count;
        }, true);
    }

    /**
     * Reset ("reload") the current page.
     *
     * @return void
     */
    reset() {
        route.reset();
        this.page = this._page;
    }

    /**
     * Getter for the current page number.
     *
     * @return integer Current page number.
     */
    get page() {
        return this._page;
    }

    /**
     * Setter for the current page. Automatically refreshes the current
     * Collection via the registered Manager.
     *
     * @return void
     */
    set page(page) {
        this._page = page;
        this.Manager.filter = this.filter;
        delete this.Manager.$count;
        this.Manager.paginate(page, params).success(items => this.items = items);
    }

};

ListController.$inject = ['$scope', '$route', '$modal'];

