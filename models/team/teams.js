const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Team = require('./team').Team;

/**
 * Data format received from Firebase.
 * @typedef {Object} TeamFirebaseValue
 * @property {boolean} active
 * @property {string} name
 * @property {string} [token]
 * @property {string} [userId]
 * @property {string} [botId]
 * @property {string} [botToken]
 */

/**
 * Load team from DB by teamId.
 * @param {string} teamId
 * @return {Promise.<?Team,Error>}
 */
function getTeam(teamId) {
  return firebaseApp.database().ref('/teams/' + teamId).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No team found.
        return Promise.resolve(null);
      } else {
        let /** @type {Object<string,TeamFirebaseValue>} */ values = snapshot.val();
        let teamConstructorValues = Object.assign(values, { $key: snapshot.key });
        let /** @type Team */ team = new Team(teamConstructorValues);
        return Promise.resolve(team);
      }
    });
}

/**
 * Respond with teams array from DB.
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise<Array<Team>,Error>
 */
function getTeams(active) {
  const reference = firebaseApp.database().ref('/teams');
  if (active !== undefined) {
    reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No teams found.
        return Promise.resolve([]);
      } else {
        let /** @type {Object<string,TeamFirebaseValue>} */ teamsFirebaseObject = snapshot.val();
        const teamsArray = [];
        for (let teamKey in teamsFirebaseObject) {
          let teamFirebaseValue = teamsFirebaseObject[teamKey];
          let teamConstructorValues = Object.assign(teamFirebaseValue, { $key: teamKey });
          let team = new Team(teamConstructorValues);
          teamsArray.push(team);
        }
        return Promise.resolve(teamsArray);
      }
    });
}

/**
 * Adds new team into DB.
 * @param {TeamFirebaseValue} teamValues
 * @param {string} teamId
 * @return Promise.<any,Error>
 */
function addTeam(teamValues, teamId) {
  return firebaseApp.database().ref('/teams/' + teamId).set(teamValues);
}

module.exports = {
  addTeam,
  getTeams,
  getTeam
};