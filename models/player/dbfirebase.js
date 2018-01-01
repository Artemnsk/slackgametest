"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseapp_1 = require("../../helpers/firebaseapp");
function processFirebaseRawValues(value) {
    return Object.assign(value, {
        items: value.items === undefined ? {} : value.items,
    });
}
/**
 * Load player from DB by teamKey and channelKey and playerKey.
 */
function getDBPlayer(teamKey, channelKey, playerKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/players/${teamKey}/${channelKey}/${playerKey}`).once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No channel found.
            return Promise.resolve(null);
        }
        else {
            const playerFirebaseValuesRaw = snapshot.val();
            return Promise.resolve(processFirebaseRawValues(playerFirebaseValuesRaw));
        }
    });
}
exports.getDBPlayer = getDBPlayer;
/**
 * Respond with channels array from DB.
 */
function getDBPlayers(teamKey, channelKey, active) {
    let reference = firebaseapp_1.firebaseApp.database().ref("/players/" + teamKey + "/" + channelKey);
    if (active !== undefined) {
        reference = reference.orderByChild("active").equalTo(active);
    }
    return reference.once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No channels found.
            return Promise.resolve({});
        }
        else {
            const playersFirebaseObjectRaw = snapshot.val();
            const playersFirebaseObject = {};
            for (const key in playersFirebaseObjectRaw) {
                if (playersFirebaseObjectRaw.hasOwnProperty(key)) {
                    playersFirebaseObject[key] = processFirebaseRawValues(playersFirebaseObjectRaw[key]);
                }
            }
            return Promise.resolve(playersFirebaseObject);
        }
    });
}
exports.getDBPlayers = getDBPlayers;
/**
 * Sets player in DB.
 * @param {PlayerFirebaseValue} playerValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} playerKey
 * @return Promise.<any,Error>
 */
function setDBPlayer(playerValues, teamKey, channelKey, playerKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/players/${teamKey}/${channelKey}/${playerKey}`).set(playerValues);
}
exports.setDBPlayer = setDBPlayer;
//# sourceMappingURL=dbfirebase.js.map