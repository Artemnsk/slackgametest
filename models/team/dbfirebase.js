"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseapp_1 = require("../../helpers/firebaseapp");
/**
 * Load team from DB by teamId.
 */
function getDBTeam(teamId) {
    return firebaseapp_1.firebaseApp.database().ref("/teams/" + teamId).once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No team found.
            return Promise.resolve(null);
        }
        else {
            const teamFirebaseValue = snapshot.val();
            return Promise.resolve(teamFirebaseValue);
        }
    });
}
exports.getDBTeam = getDBTeam;
/**
 * Respond with teams array from DB.
 */
function getDBTeams(active) {
    let reference = firebaseapp_1.firebaseApp.database().ref("/teams");
    if (active !== undefined) {
        reference = reference.orderByChild("active").equalTo(active);
    }
    return reference.once("value")
        .then((snapshot) => {
        if (!snapshot.val()) {
            // No teams found.
            return Promise.resolve({});
        }
        else {
            const teamsFirebaseObject = snapshot.val();
            return Promise.resolve(teamsFirebaseObject);
        }
    });
}
exports.getDBTeams = getDBTeams;
/**
 * Sets team data into DB.
 */
function setDBTeam(teamValues, teamId) {
    return firebaseapp_1.firebaseApp.database().ref("/teams/" + teamId).set(teamValues);
}
exports.setDBTeam = setDBTeam;
//# sourceMappingURL=dbfirebase.js.map