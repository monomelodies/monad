# Adding a custom homepage or dashboard
By default, the home page is just a basic template. If you want to override that
with your own custom, well, dashboard or whatever, just redefine the route:

```javascript
angular.module('awesome', ['monad'])
    .config(['$routeProvider', $routeProvider => {
        templateUrl: 'path/to/my/custom/home/template.html'
    }]);
```

Need a controller because you're really doing something fancy (like loading
statistics)? Just add it - there is not controller for "home" by default, so
it's perfectly safe to define your own:

```javascript
angular.module('awesome', ['monad'])
    .config(['$routeProvider', $routeProvider => {
        templateUrl: 'path/to/my/custom/home/template.html',
        controller: function () {
            // wild stuff...
        }
    }]);
```

By the way, you can add any custom URL/template in this way, there's no reason
to confine yourself to the list/CRUD logic.

