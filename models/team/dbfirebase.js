const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');

/**
 * Data format received from Firebase.
 * @typedef {Object} TeamFirebaseValue
 * @property {boolean} active
 * @property {string} name
 * @property {string} [admin]
 * @property {string} [token]
 * @property {string} [userId]
 * @property {string} [botId]
 * @property {string} [botToken]
 */

/**
 * Load team from DB by teamId.
 * @param {string} teamId
 * @return {Promise.<?TeamFirebaseValue,Error>}
 */
function getDBTeam(teamId) {
  return firebaseApp.database().ref('/teams/' + teamId).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No team found.
        return Promise.resolve(null);
      } else {
        let /** @type TeamFirebaseValue */ teamFirebaseValue = snapshot.val();
        return Promise.resolve(teamFirebaseValue);
      }
    });
}

/**
 * Respond with teams array from DB.
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise<Object.<string,TeamFirebaseValue>,Error>
 */
function getDBTeams(active) {
  let reference = firebaseApp.database().ref('/teams');
  if (active !== undefined) {
    reference = reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No teams found.
        return Promise.resolve({});
      } else {
        let /** @type {Object.<string,TeamFirebaseValue>} */ teamsFirebaseObject = snapshot.val();
        return Promise.resolve(teamsFirebaseObject);
      }
    });
}

/**
 * Sets team data into DB.
 * @param {TeamFirebaseValue} teamValues
 * @param {string} teamId
 * @return Promise.<any,Error>
 */
function setDBTeam(teamValues, teamId) {
  return firebaseApp.database().ref('/teams/' + teamId).set(teamValues);
}

module.exports = {
  setDBTeam,
  getDBTeams,
  getDBTeam
};