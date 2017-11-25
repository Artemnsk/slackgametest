class Action {
    /**
     *
     * @param values
     * @constructor
     * @property {String} type
     * @property {Number} startAt
     */
    constructor(values) {
        this.type = values.type;
        // TODO: is number?
        if (values.startAt) {
            this.startAt = values.startAt;
        } else {
            this.startAt = Date.now();
        }
    }
}

module.exports = Action;