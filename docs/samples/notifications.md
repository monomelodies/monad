# Notifications
By "notifications" we mean the common practice of adding a little number next
to a menu item to alert the editor that action is required. Monad offers a
simple interface to make this happen.

## Extend your managers
For each manager offering a notification service, Monad looks to a propery
`notify`. If its value is `undefined` or `0`, no notification is shown.

You'll need to extend your manager to query your API for notifications at the
required interval (this depends on the type of notification, obviously).
As an example:

```javascript
class Manager extends BaseManager {

    constructor($interval, ...args) {
        super(...args);
        this.notify = 0;
        $interval(() => {
            this.http.get(
                '/path/to/api/for/count/?filter=' + angular.toJson({'status': 0})
            ).success(total => this.notify = total.count);
        }, 5000);
    }

};

Manager.$inject = Array.concat(['$interval'], BaseManager.$inject);
```

This simply updates the `notify` property every 5 seconds with a `count` call to
your API.

> If your API doesn't support `count`, you'll need to do something using
> `results.length` or whatever.

Note that you probably don't want to cache these calls, since the whole idea is
that the results might change :) So, use a sane timeout.

## Updating notifications
Inject `$rootScope` and emit/broadcast/listen to custom events.

