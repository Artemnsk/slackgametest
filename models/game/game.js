const GAME_PHASES = {
  PAUSE: "PAUSE",
  OVER: "OVER",
  RUNNING: "RUNNING"
};

class Game {
  /**
   *
   * @param {GameFirebaseValue & {$key: (undefined|string)}} values
   * @constructor
   * @extends GameFirebaseValue
   * @property {string} $key - Database key of this channel.
   */
  constructor(values) {
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    if (values.$key) {
      this.$key = values.$key;
    }
  }

  /**
   *
   * @return {GameFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      timeStep: this.timeStep,
      phase: this.phase
    });
  }
}

module.exports = {
  Game,
  GAME_PHASES
};