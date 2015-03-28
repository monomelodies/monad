
export function Module(app, items)
{
    for (var name in items) {
        ['Controller', 'Service'].map(function(type) {
            app[type.toLowerCase()](name + '.' + type, items[name][type]);
        });
        app.config(['$stateProvider', function($stateProvider) {
            $stateProvider.
                state(name, {
                    url: '/' + name.toLowerCase() + '/',
                    controller: items[name].Controller,
                    controllerAs: 'list',
                    templateUrl: './' + name + '/view.html'
                });
        }]);
    }
}

