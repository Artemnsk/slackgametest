const getPlayers = require('../player/players').getPlayers;
const getNewGameRef = require('../game/games').getNewGameRef;
const setGame = require('../game/games').setGame;
const getGames = require('../game/games').getGames;
const Game = require('../game/game').Game;
const GAME_PHASES = require('../game/game').GAME_PHASES;

const CHANNEL_PHASES = {
  BREAK: "BREAK",
  IN_GAME: "IN_GAME"
};

class Channel {
  /**
   *
   * @param {ChannelFirebaseValue & {$key: string, $teamKey: string}} values
   * @constructor
   * @extends ChannelFirebaseValue
   * @property {string} $key - Database key of this channel.
   * @property {string} $teamKey - Database key of channel team.
   */
  constructor(values) {
    this.active = values.active;
    this.name = values.name;
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.breakTime = values.breakTime;
    this.$key = values.$key;
    this.$teamKey = values.$teamKey;
    if (values.nextGame) {
      this.nextGame = values.nextGame;
    }
    if (values.currentGame) {
      this.currentGame = values.currentGame;
    }
  }

  /**
   *
   * @return {Promise.<Game,Error>}
   */
  startGame() {
    if (this.phase === CHANNEL_PHASES.BREAK) {
      // Ensure there are no 'RUNNING' games.
      return getGames(this.$teamKey, this.$key, GAME_PHASES.RUNNING)
        .then((games) => {
          if (games.length === 0) {
            return getPlayers(this.$teamKey, this.$key, true)
              .then((players) => {
                // Create gamers object.
                const /** @type Object.<string,GamerFirebaseValue> */ gamers = players.reduce((gamersObj, currentPlayer) => {
                  gamersObj[currentPlayer.$key] = currentPlayer.getGamerFirebaseValue();
                  return gamersObj;
                }, {});
                const ref = getNewGameRef(this.$teamKey, this.$key);
                const /** @type GameFirebaseValue */ gameFirebaseValue = {
                  timeStep: this.timeStep,
                  phase: GAME_PHASES.RUNNING,
                  gamers
                };
                return setGame(gameFirebaseValue, this.$teamKey, this.$key, ref.key);
              });
          } else {
            let error = {
              message: `Game with '${GAME_PHASES.RUNNING}' status already exists for this channel.`
            };
            return Promise.reject(error);
          }
        });
    }
    return Promise.reject({ message: "Wrong channel phase to start a game." });
  }

  /**
   *
   * @return {ChannelFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      active: this.active,
      name: this.name,
      timeStep: this.timeStep,
      phase: this.phase,
      breakTime: this.breakTime,
      nextGame: this.nextGame ? this.nextGame : null,
      currentGame: this.currentGame ? this.currentGame : null
    });
  }
}

module.exports = {
  Channel,
  CHANNEL_PHASES
};