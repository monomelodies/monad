
"use strict";

let _page = 1;
let filter = {};

/**
 * Default "list" controller. Usually good enough if all you need is a
 * clickable list of items in a Component.
 */
export default class ListController {

    /**
     * Class constructor.
     *
     * @param object moDelete Injected moDelete service.
     * @return void
     */
    constructor(moDelete, $rootScope) {
        this.pageSize = this.pageSize || 10;
        this.filter = this.filter || {};
        angular.copy(this.filter, filter);
        if (!this.items) {
            this.page = _page;
        }
        this['delete'] = item => moDelete.ask(item);
        $rootScope.$on('moListSaved', () => this.reset());
    }

    /**
     * Reset ("reload") the current page.
     *
     * @return void
     */
    reset() {
        this.page = 1;
    }

    /**
     * Getter for the current page number.
     *
     * @return integer Current page number.
     */
    get page() {
        return _page;
    }

    /**
     * Setter for the current page. Automatically refreshes the current
     * collection via the registered resource.
     *
     * @return void
     */
    set page(page) {
        _page = page;
        this.items = this.resource.query({filter, limit: this.pageSize, offset: (page - 1) * this.pageSize});
    }

    applyFilter() {
        angular.copy(this.filter, filter);
        this.reset();
    }

    get isFilterApplied() {
        return this.filter == filter;
    }

};

ListController.$inject = ['moDelete', '$rootScope'];

