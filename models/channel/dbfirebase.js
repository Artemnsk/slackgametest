"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseapp_1 = require("../../helpers/firebaseapp");
function processFirebaseRawValues(value) {
    return Object.assign(value, {
        currentGame: value.currentGame === undefined ? null : value.currentGame,
        nextGame: value.nextGame === undefined ? null : value.nextGame,
    });
}
/**
 * Load channel from DB by channelId.
 */
function getDBChannel(teamId, channelId) {
    return firebaseapp_1.firebaseApp.database().ref(`/channels/${teamId}/${channelId}`).once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No channel found.
            return Promise.resolve(null);
        }
        else {
            const channelFirebaseValueRaw = snapshot.val();
            return Promise.resolve(processFirebaseRawValues(channelFirebaseValueRaw));
        }
    });
}
exports.getDBChannel = getDBChannel;
/**
 * Respond with channels array from DB.
 */
function getDBChannels(teamId, active) {
    let reference = firebaseapp_1.firebaseApp.database().ref(`/channels/${teamId}`);
    if (active !== undefined) {
        reference = reference.orderByChild("active").equalTo(active);
    }
    return reference.once("value")
        .then((/** admin.database.DataSnapshot */ snapshot) => {
        if (!snapshot.val()) {
            // No channels found.
            return Promise.resolve({});
        }
        else {
            const channelsFirebaseObjectRaw = snapshot.val();
            const channelsFirebaseObject = {};
            for (const key in channelsFirebaseObjectRaw) {
                if (channelsFirebaseObjectRaw.hasOwnProperty(key)) {
                    channelsFirebaseObject[key] = processFirebaseRawValues(channelsFirebaseObjectRaw[key]);
                }
            }
            return Promise.resolve(channelsFirebaseObject);
        }
    });
}
exports.getDBChannels = getDBChannels;
/**
 * Sets channel in DB.
 */
function setDBChannel(channelValues, teamKey, channelKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/channels/${teamKey}/${channelKey}`).set(channelValues);
}
exports.setDBChannel = setDBChannel;
//# sourceMappingURL=dbfirebase.js.map