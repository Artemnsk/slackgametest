const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');

/**
 * Data format received from Firebase.
 * @typedef {Object} RawActionFirebaseValue
 * @property {string} type
 * @property {string} [target]
 * @property {string} [initiator]
 * @property {{spellId: ?string}} [params]
 */

/**
 * Load most recent action from Firebase database or null if there are no actions.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} gameKey
 * @return {Promise.<?(RawActionFirebaseValue & {$key: string}), Error>}
 */
function getRecentDBRawAction(teamKey, channelKey, gameKey) {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).limitToFirst(1).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No action found.
        return Promise.resolve(null);
      } else {
        let /** @type {Object<string, RawActionFirebaseValue>} */ values = snapshot.val();
        // Get first property in object.
        let /** @type (string|undefined) */ rawActionKey;
        for (rawActionKey in values);
        if (rawActionKey !== undefined) {
          let rawActionResponse = Object.assign(values[rawActionKey], { $key: rawActionKey });
          return Promise.resolve(rawActionResponse);
        } else {
          return Promise.resolve(null);
        }
      }
    });
}

/**
 * Removes action by key from DB.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} gameKey
 * @param {string} rawActionKey
 * @return Promise<void>
 */
function removeDBRawAction(teamKey, channelKey, gameKey, rawActionKey) {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}/${rawActionKey}`).remove();
}

/**
 * Adds new action into DB.
 * @param {RawActionFirebaseValue} rawActionFirebaseValue
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} gameKey
 * @return Promise.<any,Error>
 */
function addDBRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey) {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).push().set(rawActionFirebaseValue);
}

module.exports = {
  getRecentDBRawAction,
  addDBRawAction,
  removeDBRawAction
};