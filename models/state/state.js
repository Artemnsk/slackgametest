class State {
  /**
   *
   * @param {StateFirebaseValue} values
   * @constructor
   * @property {number} number
   */
  constructor(values) {
    this.number = values.number;
  }
}

module.exports = {
  State
};