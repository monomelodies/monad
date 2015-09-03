# Adding a custom homepage or dashboard
The default `HomeController` is quite basic. It's trivial to add your own
though, including a client-specific template:

```javascript
// Assuming components and application have been setup...
angular.module('monad').config(['$routeProvider', $routeProvider => {
    $routeProvider.when('/:language/', {
        controller: MyCustomHomeController,
        templateUrl: 'path/to/my/custom/home/template.html'
    }
}]);
```

If you just want to override the `templateURL` (e.g. you just need some markup
and not any data like current amount of visitors or whatnot) use the default
controller from Monad:

```javascript
// Assuming components and application have been setup...
import HomeController from '/path/to/monad/src/controllers/HomeController';

angular.module('monad').config(['$routeProvider', $routeProvider => {
    $routeProvider.when('/:language/', {
        controller: HomeController,
        templateUrl: 'path/to/my/custom/home/template.html'
    }
}]);
```

