const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');

/**
 * Data format received from Firebase.
 * @typedef {Object} PlayerFirebaseValue
 * @property {boolean} active
 * @property {string} name
 * @property {number} gold
 */

/**
 * Load player from DB by teamKey and channelKey and playerKey.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} playerKey
 * @return {Promise.<?PlayerFirebaseValue,Error>}
 */
function getDBPlayer(teamKey, channelKey, playerKey) {
  return firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey + '/' + playerKey).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        let /** @type PlayerFirebaseValue */ playerFirebaseValues = snapshot.val();
        return Promise.resolve(playerFirebaseValues);
      }
    });
}

/**
 * Respond with channels array from DB.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise<Object.<string,PlayerFirebaseValue>,Error>
 */
function getDBPlayers(teamKey, channelKey, active) {
  const reference = firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey);
  if (active !== undefined) {
    reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve({});
      } else {
        let /** @type {Object<string,PlayerFirebaseValue>} */ playersFirebaseObject = snapshot.val();
        return Promise.resolve(playersFirebaseObject);
      }
    });
}

/**
 * Sets player in DB.
 * @param {PlayerFirebaseValue} playerValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} playerKey
 * @return Promise.<any,Error>
 */
function setDBPlayer(playerValues, teamKey, channelKey, playerKey) {
  return firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey + '/' + playerKey).set(playerValues);
}

module.exports = {
  setDBPlayer,
  getDBPlayers,
  getDBPlayer
};