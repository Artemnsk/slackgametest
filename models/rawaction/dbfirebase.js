"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseapp_1 = require("../../helpers/firebaseapp");
function processFirebaseRawValues(value) {
    return Object.assign(value, {
        initiator: value.initiator === undefined ? null : value.initiator,
        params: value.params === undefined ? {} : value.params,
        target: value.target === undefined ? null : value.target,
    });
}
/**
 * Load most recent action from Firebase database or null if there are no actions.
 */
function getRecentDBRawAction(teamKey, channelKey, gameKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).limitToFirst(1).once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No action found.
            return Promise.resolve(null);
        }
        else {
            const values = snapshot.val();
            // Get first property in object.
            let rawActionKey;
            for (rawActionKey in values) {
                // We do it to put first property into rawActionKey variable.
            }
            if (rawActionKey !== undefined) {
                const rawActionResponse = Object.assign(processFirebaseRawValues(values[rawActionKey]), { $key: rawActionKey });
                return Promise.resolve(rawActionResponse);
            }
            else {
                return Promise.resolve(null);
            }
        }
    });
}
exports.getRecentDBRawAction = getRecentDBRawAction;
/**
 * Removes action by key from DB.
 */
function removeDBRawAction(teamKey, channelKey, gameKey, rawActionKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}/${rawActionKey}`).remove();
}
exports.removeDBRawAction = removeDBRawAction;
/**
 * Adds new action into DB.
 */
function addDBRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).push().set(rawActionFirebaseValue);
}
exports.addDBRawAction = addDBRawAction;
//# sourceMappingURL=dbfirebase.js.map