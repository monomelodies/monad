
"use strict";

let _messages = [];

export default class Report {

    add(body, type, scope, timeout) {
        _messages.push({body, type, scope, timeout});
    }

    get messages() {
        return _messages;
    }

}

