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
}

module.exports = {
  Game,
  GAME_PHASES
};