# Messaging
After certain events, you might want to show "system tray"-type notifications to
your user. Monad supports these natively.

## Loading the dependency
Inject the `moReport` service where you need it:

```javascript
app.service('mySomethingService', ['moReport', function (moReport) {
    // ...
}]);
```

## Adding a message
Call `moReport.add` to add a message. `add` takes one to four parameters (in
random order).

> `add` does not translate your message for you. You should either also inject
> `gettextCatalog` and run it through `getString` first, or wrap it in an HTML
> element with the `translate` directive.

If the argument is a `number`, it is the number of milliseconds after which the
message should disappear again. If it's a full-blown Angular promise, the
message will disappear when it is resolved.

If the argument is a `string`, it is either the type of the message (one of the
Bootstrap types `info`, `warning` etc.) or else the message body.

If these tests fail and the argument is an object, it is the scope and will be
available in your message body as `msg.data`. This allows you to emit dynamic
messages, e.g. with an upload progress.

Any other argument is illegal and will throw an exception.

> Careful: if argument types appear more than once, the last found will be used.

## Full example with all options
```javascript
let myScope = {counter: 0};
moReport.add(
    'We are now here: {{ msg.data.counter }}',
    // Add an interval every second, which runs 10 times:
    $interval(function () { myScope.counter++; }, 1000, 10),
    // Custom type:
    'success',
    // Scope:
    myScope
);
```

## Return value
Adding a message returns the promise used to remove the message, so you can do
further processing (e.g. error handling using `then`'s second callback
parameter) on it.

## Handling failure
Should your promise fail, it's up to you to handle that gracefully. You should
use the second callback in your promise to do something, likely add another
message indicating failure:

```javascript
moReport.add(
    'Some operation',
    myPromise(null, function () { moReport.add('We failed', undefined, 'warning'); });
);
```

You can also use `add`'s return value, which is that promise:

```javascript
moReport.add('Some operation', myPromise).then(null, function () { /* handle failure */ });
```

## Shorthand methods
The `moReport` service offers shorthand methods too. These work the same as the
`add` method, except that the `type` parameter is implied and can thus be
omitted:

```javascript
moReport['default'](body, promise, scope)
moReport.primary(body, promise, scope)
moReport.success(body, promise, scope)
moReport.info(body, promise, scope)
moReport.warning(body, promise, scope)
moReport.danger(body, promise, scope)
```

> Again, the argument order is irrelevant.

