const CHANNEL_PHASES = {
  BREAK: "BREAK",
  IN_GAME: "IN_GAME"
};

class Channel {
  /**
   *
   * @param {ChannelFirebaseValue & {$key: (undefined|string)}} values
   * @constructor
   * @extends ChannelFirebaseValue
   * @property {string} $key - Database key of this channel.
   */
  constructor(values) {
    this.active = values.active;
    this.name = values.name;
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.breakTime = values.breakTime;
    if (values.nextGame) {
      this.nextGame = values.nextGame;
    }
    if (values.currentGame) {
      this.currentGame = values.currentGame;
    }
    if (values.$key) {
      this.$key = values.$key;
    }
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