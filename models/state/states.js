const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const State = require('./state').State;

/**
 * Data format received from Firebase.
 * @typedef {Object} StateFirebaseValue
 * @property {number} number
 */

/**
 * Load state from Firebase database.
 * @return {Promise.<?State, Error>}
 */
function getState() {
  return firebaseApp.database().ref('/state').once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No state.
        // FIXME: that is actually must be an error?
        return Promise.resolve(null);
      } else {
        let /** @type {StateFirebaseValue} */ value = snapshot.val();
        let /** @type State */ state = new State(value);
        return Promise.resolve(state);
      }
    });
}

/**
 * Saves state value into database.
 * @param {State} state
 * @return {Promise<void>}
 */
function setState(state) {
  return firebaseApp.database().ref('/state').set(state);
}

module.exports = {
  getState,
  setState
};