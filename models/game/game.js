const getDBGame = require('./dbfirebase').getDBGame;
const getDBGames = require('./dbfirebase').getDBGames;
const setDBGame = require('./dbfirebase').setDBGame;
const getNewGameDBRef = require('./dbfirebase').getNewGameDBRef;

const GAME_PHASES = {
  PAUSE: "PAUSE",
  OVER: "OVER",
  RUNNING: "RUNNING"
};

class Game {
  /**
   *
   * @param {GameFirebaseValue & {$key: string, $channelKey: string, $teamKey: string}} values
   * @constructor
   * @extends GameFirebaseValue
   * @property {Object.<string,GamerFirebaseValue>} gamers
   * @property {string} $key - Database key of this game.
   * @property {string} $channelKey - Database key of game channel.
   * @property {string} $teamKey - Database key of game team.
   */
  constructor(values) {
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.$key = values.$key;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
    this.gamers = values.gamers ? values.gamers : {};
  }

  /**
   *
   * @return {GameFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      timeStep: this.timeStep,
      phase: this.phase,
      gamers: this.gamers
    });
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} gameKey
   * @return {Promise.<?Game,Error>}
   */
  static getGame(teamKey, channelKey, gameKey) {
    return getDBGame(teamKey, channelKey, gameKey)
      .then(gameFirebaseValue => {
        let gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
        let game = new Game(gameConstructorValues);
        return Promise.resolve(game);
      });
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} [phase] - filter by phase
   * @return {Promise.<Array<Game>,Error>}
   */
  static getGames(teamKey, channelKey, phase) {
    return getDBGames(teamKey, channelKey, phase)
      .then(gamesFirebaseObject => {
        const gamesArray = [];
        for (let gameKey in gamesFirebaseObject) {
          let gameFirebaseValue = gamesFirebaseObject[gameKey];
          let gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
          let game = new Game(gameConstructorValues);
          gamesArray.push(game);
        }
        return Promise.resolve(gamesArray);
      });
  }

  /**
   * Returns new game Firebase reference.
   * @param {string} teamKey
   * @param {string} channelKey
   * @return {admin.database.ThenableReference}
   */
  static getNewGameRef(teamKey, channelKey) {
    return getNewGameDBRef(teamKey, channelKey);
  }

  /**
   * Sets game in DB.
   * @param {GameFirebaseValue} gameValues
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} gameKey
   * @return Promise.<any,Error>
   */
  static setGame(gameValues, teamKey, channelKey, gameKey) {
    return setDBGame(gameValues, teamKey, channelKey, gameKey);
  }
}

module.exports = {
  Game,
  GAME_PHASES
};