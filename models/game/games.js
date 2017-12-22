const /** @type admin.app.App */ firebaseApp = require('../../helpers/firebaseapp');
const Game = require('./game').Game;

/**
 * Data format received from Firebase.
 * @typedef {Object} GameFirebaseValue
 * @property {number} timeStep
 * @property {string} phase
 * @property {Object.<string,GamerFirebaseValue>} [gamers]
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
 * Load game from DB by teamKey, channelKey and gameKey.
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} [phase] - filter by phase
 * @return {Promise.<Array<Game>,Error>}
 */
function getGames(teamKey, channelKey, phase) {
  const reference = firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`);
  if (phase !== undefined) {
    reference.orderByChild('phase').equalTo(phase);
  }
  return reference.once('value')
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No games found.
        return Promise.resolve([]);
      } else {
        let /** @type Object.<string,GameFirebaseValue> */ gamesFirebaseObject = snapshot.val();
        const gamesArray = [];
        for (let gameKey in gamesFirebaseObject) {
          let gameFirebaseValue = gamesFirebaseObject[gameKey];
          let gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
          let game = new Game(gameConstructorValues);
          gamesArray.push(game);
        }
        return Promise.resolve(gamesArray);
      }
    });
}

/**
 * Returns new game Firebase reference.
 * @param {string} teamKey
 * @param {string} channelKey
 * @return {admin.database.ThenableReference}
 */
function getNewGameRef(teamKey, channelKey) {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`).push();
}

/**
 * Sets game in DB.
 * @param {GameFirebaseValue} gameValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} gameKey
 * @return Promise.<any,Error>
 */
function setGame(gameValues, teamKey, channelKey, gameKey) {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).set(gameValues);
}

module.exports = {
  getGame,
  getNewGameRef,
  setGame,
  getGames
};