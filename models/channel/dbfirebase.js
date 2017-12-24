const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');

/**
 * Data format received from Firebase.
 * @typedef {Object} ChannelFirebaseValue
 * @property {boolean} active
 * @property {string} name
 * @property {number} timeStep - minimum time between player steps in ms
 * @property {number} breakTime - break time in ms
 * @property {string} phase
 * @property {number} [nextGame]
 * @property {string} [currentGame]
 */

/**
 * Load channel from DB by channelId.
 * @param {string} teamId
 * @param {string} channelId
 * @return {Promise.<?ChannelFirebaseValue,Error>}
 */
function getDBChannel(teamId, channelId) {
  return firebaseApp.database().ref('/channels/' + teamId + '/' + channelId).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        let /** @type ChannelFirebaseValue */ channelFirebaseValue = snapshot.val();
        return Promise.resolve(channelFirebaseValue);
      }
    });
}

/**
 * Respond with channels array from DB.
 * @param {string} teamId
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise.<Object.<string,ChannelFirebaseValue>,Error>
 */
function getDBChannels(teamId, active) {
  let reference = firebaseApp.database().ref('/channels/' + teamId);
  if (active !== undefined) {
    reference = reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve({});
      } else {
        let /** @type {Object<string,ChannelFirebaseValue>} */ channelsFirebaseObject = snapshot.val();
        return Promise.resolve(channelsFirebaseObject);
      }
    });
}

/**
 * Sets channel in DB.
 * @param {ChannelFirebaseValue} channelValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @return Promise.<any,Error>
 */
function setDBChannel(channelValues, teamKey, channelKey) {
  return firebaseApp.database().ref('/channels/' + teamKey + '/' + channelKey).set(channelValues);
}

module.exports = {
  setDBChannel,
  getDBChannels,
  getDBChannel
};