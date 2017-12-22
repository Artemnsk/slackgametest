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
}

module.exports = {
  Player
};