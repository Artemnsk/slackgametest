"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseapp_1 = require("../../helpers/firebaseapp");
const dbfirebase_1 = require("../gamer/dbfirebase");
function processFirebaseRawValues(value) {
    const gamers = {};
    if (value.gamers !== undefined) {
        for (const key in value.gamers) {
            if (value.gamers.hasOwnProperty(key)) {
                gamers[key] = dbfirebase_1.processFirebaseRawValues(value.gamers[key]);
            }
        }
    }
    return Object.assign(value, {
        gamers,
    });
}
/**
 * Load game from DB by teamKey, channelKey and gameKey.
 */
function getDBGame(teamKey, channelKey, gameKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No game found.
            return Promise.resolve(null);
        }
        else {
            const gameFirebaseValueRaw = snapshot.val();
            return Promise.resolve(processFirebaseRawValues(gameFirebaseValueRaw));
        }
    });
}
exports.getDBGame = getDBGame;
/**
 * Load game from DB by teamKey, channelKey and gameKey.
 * @return {Promise.<Object.<string,GameFirebaseValue>,Error>}
 */
function getDBGames(teamKey, channelKey, phase) {
    let reference = firebaseapp_1.firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`);
    if (phase !== undefined) {
        reference = reference.orderByChild("phase").equalTo(phase);
    }
    return reference.once("value")
        .then((/** admin.database.DataSnapshot */ snapshot) => {
        if (!snapshot.val()) {
            // No games found.
            return Promise.resolve({});
        }
        else {
            const gamesFirebaseObjectRaw = snapshot.val();
            const gamesFirebaseObject = {};
            for (const key in gamesFirebaseObjectRaw) {
                if (gamesFirebaseObjectRaw.hasOwnProperty(key)) {
                    gamesFirebaseObject[key] = processFirebaseRawValues(gamesFirebaseObjectRaw[key]);
                }
            }
            return Promise.resolve(gamesFirebaseObject);
        }
    });
}
exports.getDBGames = getDBGames;
/**
 * Returns new game Firebase reference.
 */
function getNewGameDBRef(teamKey, channelKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`).push();
}
exports.getNewGameDBRef = getNewGameDBRef;
/**
 * Sets game in DB.
 */
function setDBGame(gameValues, teamKey, channelKey, gameKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).set(gameValues);
}
exports.setDBGame = setDBGame;
/**
 * Remove game from DB.
 */
function removeDBGame(teamKey, channelKey, gameKey) {
    return firebaseapp_1.firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).remove();
}
exports.removeDBGame = removeDBGame;
//# sourceMappingURL=dbfirebase.js.map