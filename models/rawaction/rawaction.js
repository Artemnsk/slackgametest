"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbfirebase_1 = require("./dbfirebase");
class RawAction {
    /**
     * Respond with most recent rawAction from DB.
     */
    static getRecentRawAction(teamKey, channelKey, gameKey) {
        return dbfirebase_1.getRecentDBRawAction(teamKey, channelKey, gameKey)
            .then((recentRawActionData) => {
            if (recentRawActionData === null) {
                return Promise.resolve(null);
            }
            else {
                const recentRawAction = new RawAction(recentRawActionData);
                return Promise.resolve(recentRawAction);
            }
        });
    }
    static removeRawAction(teamKey, channelKey, gameKey, rawActionKey) {
        return dbfirebase_1.removeDBRawAction(teamKey, channelKey, gameKey, rawActionKey);
    }
    /**
     * Adds new action into DB.
     */
    static addRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey) {
        return dbfirebase_1.addDBRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey);
    }
    constructor(values) {
        this.type = values.type;
        this.$key = values.$key;
        if (values.target) {
            this.target = values.target;
        }
        if (values.initiator) {
            this.initiator = values.initiator;
        }
        if (values.params) {
            this.params = values.params;
        }
    }
    getFirebaseValue() {
        return Object.assign({}, {
            initiator: this.initiator,
            params: this.params,
            target: this.target,
            type: this.type,
        });
    }
}
exports.RawAction = RawAction;
//# sourceMappingURL=rawaction.js.map