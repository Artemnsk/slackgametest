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
   * @property {Object.<string,boolean>} spells
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
    this.spells = values.spells ? values.spells : {};
    this.$key = values.$key;
    this.$gameKey = values.$gameKey;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
  }

  /**
   * @return string
   */
  getGameStats() {
    if (this.dead) {
      return `${this.name} DEAD`;
    } else {
      return `\`${this.name}\` :heart:${this.health} :large_blue_diamond:${this.mana}`;
    }
  }

  /**
   *
   * @return {GamerFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      name: this.name,
      dead: this.dead,
      health: this.health,
      mana: this.mana,
      spells: this.spells
    });
  }
}

module.exports = {
  Gamer
};