/**
 *
 * @typedef {Object} GamerFirebaseValue
 * @property {string} name
 * @property {boolean} dead
 * @property {number} health
 * @property {number} mana
 * @property {Object.<string,boolean>} [spells]
 */

class Gamer {
  /**
   *
   * @param {GamerFirebaseValue & {$key: string, $gameKey, $channelKey: string, $teamKey: string}} values
   * @constructor
   * @extends GameFirebaseValue
   * @property {string} $key - Database key of this player.
   * @property {string} $gameKey - Database key of player game.
   * @property {string} $channelKey - Database key of player channel.
   * @property {string} $teamKey - Database key of player team.
   *
   */
  constructor(values) {
    this.name = values.name;
    this.dead = values.dead;
    this.health = values.health;
    this.mana = values.mana;
    this.$key = values.$key;
    this.$gameKey = values.$gameKey;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
  }

  /**
   *
   * @return {GameFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      name: this.name,
      dead: this.dead,
      health: this.health,
      mana: this.mana
    });
  }
}

module.exports = {
  Gamer
};