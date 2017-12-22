const getPlayers = require('../player/players').getPlayers;

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
      return getPlayers(this.$teamKey, this.$key, true)
        .then((players) => {
          // TODO: put them into new game.
          // TODO: ensure there are no unfinished games.
          // TODO: some player.getGamer() method.
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