const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Player = require('./player').Player;

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
 * @return {Promise.<?Player,Error>}
 */
function getPlayer(teamKey, channelKey, playerKey) {
  return firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey + '/' + playerKey).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        let /** @type PlayerFirebaseValue */ values = snapshot.val();
        let playerConstructorValues = Object.assign(values, { $key: snapshot.key, $channelKey: channelKey, $teamKey: teamKey });
        let player = new Player(playerConstructorValues);
        return Promise.resolve(player);
      }
    });
}

/**
 * Respond with channels array from DB.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise<Array<Player>,Error>
 */
function getPlayers(teamKey, channelKey, active) {
  const reference = firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey);
  if (active !== undefined) {
    reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve([]);
      } else {
        let /** @type {Object<string,PlayerFirebaseValue>} */ playersFirebaseObject = snapshot.val();
        const playersArray = [];
        for (let playerKey in playersFirebaseObject) {
          let playerFirebaseValue = playersFirebaseObject[channelKey];
          let playerConstructorValues = Object.assign(playerFirebaseValue, { $key: playerKey, $channelKey: channelKey, $teamKey: teamKey });
          let player = new Player(playerConstructorValues);
          playersArray.push(player);
        }
        return Promise.resolve(playersArray);
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
function setPlayer(playerValues, teamKey, channelKey, playerKey) {
  return firebaseApp.database().ref('/players/' + teamKey + '/' + channelKey + '/' + playerKey).set(playerValues);
}

module.exports = {
  setPlayer,
  getPlayers,
  getPlayer
};