
"use strict";

class UploadController {

    constructor() {
        this.state = 'select';
    }

    selectFile($file, target) {
        this.state = 'progress';
    }

};

export {UploadController};

