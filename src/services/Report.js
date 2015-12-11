
"use strict";

let _messages = [];

export default class Report {

    add(body, type, scope, promise) {
        let msg = {body, type, scope};
        let i = _messages.length;
        _messages.push(msg);
        promise.then(
            () => _messages.splice(i, 1),
            () => _messages.splice(i, 1)
        );
    }

    get messages() {
        return _messages;
    }

}

