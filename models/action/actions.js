const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Action = require('./action').Action;

/**
 * Data format received from Firebase.
 * @typedef {Object} ActionFirebaseValue
 * @property {string} type
 * @property {number} startAt
 * @property {number} [number]
 */

/**
 * Load most recent action from Firebase database or null if there are no actions.
 * @return {Promise.<?Action, Error>}
 */
function getRecentAction() {
  return firebaseApp.database().ref('/actions').orderByChild('startAt').endAt(Date.now()).limitToFirst(1).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No action found.
        return Promise.resolve(null);
      } else {
        let /** @type {Object<string, ActionFirebaseValue>} */ values = snapshot.val();
        // Get first property in object.
        let /** @type (string|undefined) */ actionKey;
        for (actionKey in values);
        if (actionKey !== undefined) {
          let actionConstructorValues = Object.assign(values[actionKey], { $key: actionKey });
          let /** @type Action */ action = new Action(actionConstructorValues);
          return Promise.resolve(action);
        } else {
          return Promise.resolve(null);
        }
      }
    });
}

/**
 * Removes action by key from DB.
 * @param {string} key
 * @return Promise<void>
 */
function removeAction(key) {
  return firebaseApp.database().ref('/actions/' + key).remove();
}

/**
 * Adds new action into DB.
 * @param {ActionFirebaseValue} action
 */
function addAction(action) {
  return firebaseApp.database().ref('/actions').push().set(action);
}

module.exports = {
  getRecentAction,
  addAction,
  removeAction
};