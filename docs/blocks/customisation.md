# Basic customisation
Monad has a few quick and dirty customisation options for most day-to-day
customisation. The are all attributes of the `$rootScope` of your application,
hence they should be set in a `run` call on your module:

```javascript
angular.module('awesome', ['monad'])
    .run(['$rootScope', function ($rootScope) {
        // A friendly page title
        $rootScope.title = 'My awesome administrator!';
        // Default is ['en', 'nl']
        $rootScope.languages = ['fr', 'de', 'es'];
        // For development
        $rootScope.liveReload = '/url/to/live/reload.js';
    }]);
```

To customize stuff like the logo image, simply use your own. You can also
replace `admin.css` with something of your own making - it can be based on Monad
and/or Bootstrap for convenience, but if you want to write something from
scratch: be our guest!

