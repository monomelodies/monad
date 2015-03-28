
;(function() {
"use strict";

var app = angular.module('monad', ['ui.router', 'pascalprecht.translate']);

app.config(['$stateProvider', '$locationProvider', '$translateProvider', function($stateProvider, $locationProvider, $translateProvider) {

$translateProvider.preferredLanguage('en');
$stateProvider.
    state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: '/monad/template/home.html'
    }).
    state('module', {
        url: '/module/:module/',
        controller: 'ModuleController',
        controllerAs: 'module',
        templateUrl: '/monad/template/module.html'
    }).
    state('module_item', {
        url: '/module/:module/{id:[0-9A-Za-z=]{1,}}/',
        controller: 'ItemController',
        controllerAs: 'item',
        templateUrl: '/monad/template/item.html'
    });
$locationProvider.html5Mode(true);

}]);

app.run(['ModuleService', '$http', 'Base64', function(ModuleService, $http, Base64) {

ModuleService.register('pages', {
    list: {
        columns: [
            {field: 'id', header: '#'},
            {field: 'title', header: 'Title'}
        ],
        get: function() {
            return $http.get('/api/page/');
        }
    },
    item: {
        get: function(id) {
            return $http.get('/api/page/' + id + '/');
        },
        title: 'title',
        fields: [
            {title: 'Data', fields: [
                {field: 'id', label: '#', widget: '/monad/template/widgets/pk.html'},
                {field: 'title', label: 'Title', widget: '/monad/template/widgets/text.html'}
            ]}
        ]
    },
    title: 'Pages',
    pkFields: ['id']
});
ModuleService.register('projects', {
    list: {
        columns: [
            {field: 'id', header: '#'},
            {field: 'title', header: 'Title'},
        ],
        get: function() {
           return $http.get('/api/project_category/');
        }
    },
    item: {
        get: function(id) {
            return $http.get('/api/project_category/' + id + '/');
        },
        title: 'title',
        fields: [
            {title: 'Data', fields: [
                {field: 'id', label: '#', widget: '/monad/template/widgets/pk.html'},
                {field: 'title', label: 'Title', widget: '/monad/template/widgets/text.html'}
            ]}
        ],
        links: ['project']
    },
    title: 'Projects',
    pkFields: ['id']
});
ModuleService.register('project', {
    list: {
        columns: [
            {field: 'id', header: '#'},
            {field: 'title', header: 'Title'},
        ],
        get: function(filter) {
            if (filter) {
                var data = angular.fromJson(Base64.decode(filter));
                filter = {};
                filter.category = data.id;
                filter = angular.toJson(filter);
            }
           return $http.get('/api/project/' + (filter ? '?filter=' + filter : ''));
        }
    },
    item: {
        get: function(id) {
            return $http.get('/api/project/' + id + '/');
        },
        title: 'title',
        fields: [
            {title: 'Data', fields: [
                {field: 'id', label: '#', widget: '/monad/template/widgets/pk.html'},
                {field: 'title', label: 'Title', widget: '/monad/template/widgets/text.html'}
            ]}
        ],
        links: ['project_media']
    },
    title: 'Projects',
    pkFields: ['id']
});
ModuleService.register('project_media', {
    list: {
        columns: [
            {field: 'media', header: 'Media'}
        ],
        get: function(filter) {
            if (filter) {
                var data = angular.fromJson(Base64.decode(filter));
                filter = {};
                filter.project = data.id;
                filter = angular.toJson(filter);
            }
           return $http.get('/api/project_media/' + (filter ? '?filter=' + filter : ''));
        }
    },
    item: {
        get: function(id) {
            return $http.get('/api/project_media/' + id + '/');
        },
        title: 'title',
        fields: [
            {title: 'Data', fields: [
                {field: 'id', label: '#', widget: '/monad/template/widgets/pk.html'},
                {field: 'title', label: 'Title', widget: '/monad/template/widgets/text.html'}
            ]}
        ]
    },
    title: 'Project media',
    pkFields: ['project', 'media']
});

}]);

app.service('ModuleService', ['Base64', function(Base64) {

var modules = {};
this.register = function(name, definition) {
    if (!('url' in definition)) {
        definition.url = function(item) {
            var params = {};
            definition.pkFields.map(function(field) {
                params[field] = item[field];
            });
            params = angular.toJson(params);
            params = Base64.encode(params);
            return '/monad/module/' + name + '/' + params + '/';
        };
    }
    modules[name] = definition;
};
this.find = function(name) {
    return modules[name];
};

}]);

app.controller('RootController', ['$rootScope', function($rootScope) {

$rootScope.MainNav = [
    {url: '/', title: 'Site'},
    {url: '/monad/module/pages/', title: 'Pages'},
    {url: '/monad/module/news/', title: 'News'},
    {url: '/monad/module/projects/', title: 'Projects'}
];

}]);

app.controller('HomeController', [function() {

}]);

app.controller('ModuleController', ['$stateParams', '$rootScope', 'ModuleService', function($stateParams, $rootScope, ModuleService) {

var that = this;
var module = ModuleService.find($stateParams.module);
that.columns = module.list.columns;
$rootScope.title = module.title || $stateParams.module;
module.list.get().success(function(items) {
    that.items = items;
});
this.url = module.url;

}]);

app.controller('ItemController', ['$stateParams', '$rootScope', 'ModuleService', function($stateParams, $rootScope, ModuleService) {

var that = this;
var module = ModuleService.find($stateParams.module);
$rootScope.title = module.title || $stateParams.module;
module.item.get($stateParams.id).success(function(item) {
    that.data = item;
    $rootScope.title = item[module.item.title] + ' - ' + $rootScope.title;
});
this.fields = module.item.fields;
this.list = '/monad/module/' + $stateParams.module + '/';
that.links = [];
if (module.item.links) {
    module.item.links.map(function(link) {
        var submodule = ModuleService.find(link);
        submodule.list.get($stateParams.id).success(function(items) {
            that.links.push({
                columns: submodule.list.columns,
                items: items,
                url: submodule.url
            });
        });
    });
}

}]);

})();

