const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Channel = require('./channel').Channel;

/**
 * Data format received from Firebase.
 * @typedef {Object} ChannelFirebaseValue
 * @property {boolean} active
 * @property {string} name
 */

/**
 * Load channel from DB by channelId.
 * @param {string} teamId
 * @param {string} channelId
 * @return {Promise.<?Channel,Error>}
 */
function getChannel(teamId, channelId) {
  return firebaseApp.database().ref('/channels/' + teamId + '/' + channelId).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        let /** @type {Object<string,ChannelFirebaseValue>} */ values = snapshot.val();
        let channelConstructorValues = Object.assign(values, { $key: snapshot.key });
        let channel = new Channel(channelConstructorValues);
        return Promise.resolve(channel);
      }
    });
}

/**
 * Respond with channels array from DB.
 * @param {string} teamId
 * @param {boolean} [active] - filter by 'active' field. No filter if not set.
 * @return Promise<Array<Channel>,Error>
 */
function getChannels(teamId, active) {
  const reference = firebaseApp.database().ref('/channels/' + teamId);
  if (active !== undefined) {
    reference.orderByChild('active').equalTo(active);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve([]);
      } else {
        let /** @type {Object<string,ChannelFirebaseValue>} */ channelsFirebaseObject = snapshot.val();
        const channelsArray = [];
        for (let channelKey in channelsFirebaseObject) {
          let channelFirebaseValue = channelsFirebaseObject[channelKey];
          let channelConstructorValues = Object.assign(channelFirebaseValue, { $key: channelKey });
          let channel = new Channel(channelConstructorValues);
          channelsArray.push(channel);
        }
        return Promise.resolve(channelsArray);
      }
    });
}

/**
 * Adds new channel into DB.
 * @param {ChannelFirebaseValue} channelValues
 * @param {string} channelId
 * @return Promise.<any,Error>
 */
function addChannel(channelValues, channelId) {
  return firebaseApp.database().ref('/channels/' + channelId).set(channelValues);
}

module.exports = {
  addChannel,
  getChannels,
  getChannel
};