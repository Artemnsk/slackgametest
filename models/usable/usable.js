"use strict";

class Usable {
    constructor(data) {
        this.emoji = data.emoji;
    }

    /**
     * Returns Form for usage.
     * @return {Object}
     */
    useForm() {
        return {};
    }


}

module.exports = Usable;