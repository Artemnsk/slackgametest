/**
 * @typedef {Object} SpellData
 * @property {String} emoji
 * @property {String} id
 * @property {String} label
 * @property {String} description
 * @property {{damage: ?number, manacost: ?number}} ?params
 */

class Spell {
  /**
   *
   * @param {SpellData} spellData
   * @constructor
   * @extends SpellData
   */
  constructor(spellData) {
    this.emoji = spellData.emoji;
    this.id = spellData.id;
    this.label = spellData.label;
    this.description = spellData.description;
    this.params = spellData.params;
  }

  getInfo() {
    return [
      {
        title: "Description",
        value: this.description,
        short: false
      }, {
        title: "Damage",
        value: this.params.damage,
        short: true
      }
    ];
  }

  // TODO:
  getCastForm() {

  }

  // TODO:
  processCastForm() {

  }
}

module.exports = {
  Spell
};