
;(function() {
"use strict";

var monad = angular.module('monad', ['monolyth']);

/**
 * A mock service to make dependency injection work correctly from
 * ngRoute's resolve parameter.
 */
var page = undefined;
monad.factory('page', function() {
    return page;
});

monad.controller('monad.PageController', ['$scope', 'page', function($scope, page) {

if (page) {
    $scope.page = page.data;
    $scope.Page.title = $scope.page.title;
}

}]);

monad.factory('monad.Page', ['$http', '$cacheFactory', function($http, $cacheFactory) {

var cache = $cacheFactory('monad.page');

return {
    get: function(language, slug) {
        return $http.get('/monad/page/' + language + '/' + slug + '/', {cache: cache});
    }
};

}]);

monad.factory('monad.Section', ['$http', '$cacheFactory', function($http, $cacheFactory) {

var cache = $cacheFactory('monad.section');

return {
    get: function(language, slug) {
        return $http.get('/monad/section/' + language + '/' + slug + '/', {cache: cache});
    }
};

}]);

})();

