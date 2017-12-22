const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Game = require('./game').Game;

/**
 * Data format received from Firebase.
 * @typedef {Object} GameFirebaseValue
 * @property {number} timeStep
 * @property {string} phase
 */

/**
 * Load game from DB by teamKey, channelKey and gameKey.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} gameKey
 * @return {Promise.<?Game,Error>}
 */
function getGame(teamKey, channelKey, gameKey) {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No game found.
        return Promise.resolve(null);
      } else {
        let /** @type GameFirebaseValue */ values = snapshot.val();
        let gameConstructorValues = Object.assign(values, { $key: snapshot.key, $channelKey: channelKey, $teamKey: teamKey });
        let game = new Game(gameConstructorValues);
        return Promise.resolve(game);
      }
    });
}

/**
 * Create game in DB.
 * @param {GameFirebaseValue} gameValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @return Promise.<any,Error>
 */
function createGame(gameValues, teamKey, channelKey) {
  const snapshot = firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`).push();
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${snapshot.key}`).set(gameValues);
}

module.exports = {
  createGame,
  getGame
};