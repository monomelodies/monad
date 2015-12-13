
"use strict";

let _messages = [];
let $timeout = undefined;

export default class Report {

    /**
     * Constructor. Injects $timeout service.
     *
     * @param timeout Angular $timeout service.
     * @return void
     */
    constructor(timeout) {
        $timeout = timeout;
    }

    /**
     * Adds a message to the tray. The message disappears when its associated
     * `promise` resolves. Arguments can be passed in random order.
     *
     * @param string body The message body, can contain HTML with directives
     *  etc. (it is compiled for you).
     * @param mixed promise Either `undefined` (defaults to 3 seconds), a number
     *  of milliseconds after which to resolve, or a full-fledged Angular
     *  promise.
     * @param string type Bootstrap message type (`info`, `warning` etc.).
     * @param object scope Scope to use on the message. Is available inside your
     *  body as `msg.data`.
     * @return promise The promise used to remove the message is returned, e.g.
     *  for additional (error) handling.
     */
    add(...args) {
        let body = '';
        let promise = $timeout(() => {}, 3000);
        let type = 'default';
        let scope = {};
        args.map(arg => {
            if (arg === undefined) {
                return;
            } else if (typeof arg == 'number') {
                promise = $timeout(() => {}, arg);
            } else if (typeof arg == 'string') {
                if (['default', 'primary', 'success', 'info', 'warning', 'danger'].indexOf(arg) != -1) {
                    type = arg;
                } else {
                    body = arg;
                }
            } else if (typeof arg == 'object') {
                if (arg.then && typeof arg.then == 'function') {
                    promise = arg;
                } else {
                    scope = arg;
                }
            } else {
                let type = typeof arg;
                throw `Argument ${arg} of type ${type} is not valid for messages.`;
            }
        });
        let msg = {body, type, scope};
        let i = _messages.length;
        _messages.push(msg);
        let handler = () => _messages.splice(i, 1);
        return promise.then(handler, handler);
    }

    /**
     * Getter for your messages. These are by default available on the root
     * controller (`monad`) as `monad.messages`.
     *
     * @return array Array of current messages.
     */
    get messages() {
        return _messages;
    }

    /**
     * Convenience method to add a `default` message.
     *
     * @see Report.add
     * @return promise
     */
    ['default'](...args) {
        return this.add(...args.concat(['default']));
    }

    /**
     * Convenience method to add a `primary` message.
     *
     * @see Report.add
     * @return promise
     */
    primary(...args) {
        return this.add(...args.concat(['primary']));
    }

    /**
     * Convenience method to add a `success` message.
     *
     * @see Report.add
     * @return promise
     */
    success(...args) {
        return this.add(...args.concat(['success']));
    }

    /**
     * Convenience method to add an `info` message.
     *
     * @see Report.add
     * @return promise
     */
    info(...args) {
        return this.add(...args.concat(['info']));
    }

    /**
     * Convenience method to add a `warning` message.
     *
     * @see Report.add
     * @return promise
     */
    warning(...args) {
        return this.add(...args.concat(['warning']));
    }

    /**
     * Convenience method to add a `danger` message.
     *
     * @see Report.add
     * @return promise
     */
    danger(...args) {
        return this.add(...args.concat(['danger']));
    }

}

Report.$inject = ['$timeout'];

