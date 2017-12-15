class Player {
  /**
   *
   * @param {PlayerFirebaseValue & {$key: (undefined|string)}} values
   * @constructor
   * @extends PlayerFirebaseValue
   * @property {string} $key - Database key of this channel.
   */
  constructor(values) {
    this.active = values.active;
    this.name = values.name;
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
      name: this.name
    });
  }
}

module.exports = {
  Player
};