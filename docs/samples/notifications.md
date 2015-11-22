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
let $interval = undefined;
let notifications = undefined;

export default class Manager extends BaseManager {

    constructor($interval, ...args) {
        super(args[0], args[1]);
    }

    get notify() {
        let update = () => {
            this.http.get(
                '/path/to/api/for/count/?filter=' + angular.toJson({'status': 0})
            ).success(total => notifications = total.count);
        };
        if (notifications === undefined) {
            update();
        }
        $interval(update, 5000);
    }

};

Manager.$inject = ['$interval'].concat(BaseManager.$inject);
```

This simply updates the `notify` property every 5 seconds with a `count` call to
your API.

> If your API doesn't support `count`, you'll need to do something using
> `results.length` or whatever.

Note that you probably don't want to cache these calls, since the whole idea is
that the results might change :) So, use a sane timeout.

> For bonus points, you could consider implementing notifications using
> something like [socket.io](http://socket.io).

## Updating notifications
Inject `$rootScope` and emit/broadcast/listen to custom events where required.

Another common scenario is to have a base Manager for an API which handles
common calls by looking at a `this.constructor.endpoint` or such. On save, this
could also update its own notifications (or emit an event of course, depending
on your situation, which is handled in another Manager). If your API is _really_
consistent, you could even write that into the base Manager itself!

Slightly pseudo-coded example:

```javascript
let notifications = undefined;

export default class BaseManager extends MonadBaseManager {

    constructor($http, $cacheFactory) {
        super($http, $cacheFactory);
    }

    save(model) {
        super.save(model).then(() => {
            // Obviously, the path would also include `this.constructor.endpoint` somewhere.
            $http.get('/path/to/endpoint/for/notifications/').success(notifications => notifications);
        });
    }

    get notify() {
        if (notifications == undefined) {
            $http.get('/path/to/endpoint/for/notifications/').success(notifications => notifications);
        }
        return notifications;
    }

}

BaseManager.$inject = MonadBaseManager.$inject;
```

Making this work with sockets is beyond the scope of this tutorial, but we have
good experiences with the [`btford-socket.io`](https://github.com/btford/angular-socket-io)
Angular module.

