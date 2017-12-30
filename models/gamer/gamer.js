const /** @type Array<Spell> */ spells = require('../../storage/spells/spells');
const /** @type Array<Item> */ items = require('../../storage/items/items');

/**
 *
 * @typedef {Object} GamerFirebaseValue
 * @property {string} name
 * @property {boolean} dead
 * @property {number} health
 * @property {number} mana
 * @property {Object.<string,boolean>} [spells]
 * @property {Object.<string,boolean>} [items]
 */

class Gamer {
  /**
   *
   * @param {GamerFirebaseValue & {$key: string, $gameKey, $channelKey: string, $teamKey: string}} values
   * @constructor
   * @extends GameFirebaseValue
   * @property {Object.<string,boolean>} spells
   * @property {Object.<string,boolean>} items
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
    this.items = values.items ? values.items : {};
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
   * @return {Array<Spell>}
   */
  getSpells() {
    return spells.filter(spell => this.spells && this.spells[spell.id] === true);
  }

  /**
   *
   * @return {Array<Item>}
   */
  getItems() {
    return items.filter(item => this.items && this.items[item.id] === true);
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
      spells: this.spells,
      items: this.items
    });
  }
}

module.exports = {
  Gamer
};