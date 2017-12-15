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
      timeStep: this.timeStep
    });
  }
}

module.exports = {
  Channel
};