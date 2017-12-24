const getDBPlayer = require('./dbfirebase').getDBPlayer;
const getDBPlayers = require('./dbfirebase').getDBPlayers;
const setDBPlayer = require('./dbfirebase').setDBPlayer;

class Player {
  /**
   *
   * @param {PlayerFirebaseValue & {$key: string, $channelKey: string, $teamKey: string} values
   * @constructor
   * @extends PlayerFirebaseValue
   * @property {string} $key - Database key of this player.
   * @property {string} $channelKey - Database key of player channel.
   * @property {string} $teamKey - Database key of player team.
   */
  constructor(values) {
    this.active = values.active;
    this.name = values.name;
    this.gold = values.gold;
    this.$key = values.$key;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
  }

  /**
   *
   * @return GamerFirebaseValue
   */
  getGamerFirebaseValue() {
    return {
      name: this.name,
      dead: false,
      // TODO: set somewhere? Maybe channel/game setting?
      health: 100,
      mana: 40
    };
  }

  /**
   *
   * @return {PlayerFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      active: this.active,
      name: this.name,
      gold: this.gold
    });
  }

  /**
   * Load player from DB by teamKey and channelKey and playerKey.
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} playerKey
   * @return {Promise.<?Player,Error>}
   */
  static getPlayer(teamKey, channelKey, playerKey) {
    return getDBPlayer(teamKey, channelKey, playerKey)
      .then(playerFirebaseValue => {
        if (playerFirebaseValue) {
          let playerConstructorValues = Object.assign(playerFirebaseValue, { $key: playerKey, $channelKey: channelKey, $teamKey: teamKey });
          let player = new Player(playerConstructorValues);
          return Promise.resolve(player);
        } else {
          return Promise.resolve(playerFirebaseValue);
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
  static getPlayers(teamKey, channelKey, active) {
    return getDBPlayers(teamKey, channelKey, active)
      .then(playersFirebaseObject => {
        const playersArray = [];
        for (let playerKey in playersFirebaseObject) {
          let playerFirebaseValue = playersFirebaseObject[playerKey];
          let playerConstructorValues = Object.assign(playerFirebaseValue, { $key: playerKey, $channelKey: channelKey, $teamKey: teamKey });
          let player = new Player(playerConstructorValues);
          playersArray.push(player);
        }
        return Promise.resolve(playersArray);
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
  static setPlayer(playerValues, teamKey, channelKey, playerKey) {
    return setDBPlayer(playerValues, teamKey, channelKey, playerKey);
  }
}

module.exports = {
  Player
};