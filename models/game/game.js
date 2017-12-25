const getDBGame = require('./dbfirebase').getDBGame;
const getDBGames = require('./dbfirebase').getDBGames;
const setDBGame = require('./dbfirebase').setDBGame;
const getNewGameDBRef = require('./dbfirebase').getNewGameDBRef;
const removeDBGame = require('./dbfirebase').removeDBGame;
const Gamer = require('../gamer/gamer').Gamer;
const /** @type Array<Spell> */ spells = require('../../storage/spells/spells');

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
   * @param {string} userKey
   * @return {?Gamer}
   */
  getGamer(userKey) {
    if (this.gamers[userKey]) {
      let gamerConstructorValue = Object.assign(this.gamers[userKey], {
        $key: userKey,
        $gameKey: this.$key,
        $channelKey: this.$channelKey,
        $teamKey: this.$teamKey
      });
      return new Gamer(gamerConstructorValue);
    } else {
      return null;
    }
  }

  /**
   * @param {Object<string,Gamer>} gamers
   * @param {number} quantity - how many spells to assign to each gamer.
   * @return {Object<string,Gamer>}
   */
  static assignSpells(gamers, quantity) {
    for (let gamerKey in gamers) {
      let /** @type Object<string,boolean> */ currentGamerSpells = {};
      for (let i = 0; i < quantity; i++) {
        let j = null;
        // If it is first iteration or this spell already being added.
        while (j === null || currentGamerSpells[spells[j].id] === true) {
          j = Math.floor(Math.random() * spells.length);
        }
        currentGamerSpells[spells[j].id] = true;
      }
      gamers[gamerKey].spells = currentGamerSpells;
    }
    return gamers;
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

  static removeGame(teamKey, channelKey, gameKey) {
    return removeDBGame(teamKey, channelKey, gameKey);
  }
}

module.exports = {
  Game,
  GAME_PHASES
};