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

  /**
   * Returns select Action for uiAttachment with non-dead gamers (even with empty opts).
   * @param {string} callback_id
   * @param {Game} game
   * @return ?Object
   */
  getCastForm(callback_id, game) {
    let options = [];
    for (let gamerKey in game.gamers) {
      if (game.gamers[gamerKey].dead === false) {
        options.push({
          text: game.gamers[gamerKey].name,
          value: gamerKey
        });
      }
    }
    if (options.length > 0) {
      return {
        name: "target",
        text: "Target",
        type: "select",
        options
      };
    } else {
      return null;
    }
  }

  /**
   * @param {ParsedSlackActionPayload} parsedPayload
   * @return boolean
   */
  processCastForm(parsedPayload) {
    let action = parsedPayload.actions[0];
    switch (action.name) {
      case 'target':
        let gamerKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
        if (gamerKey) {
          // TODO: create actionRequest.
          return true;
        }
        return false;
        break;
    }
    return false;
  }
}

module.exports = {
  Spell
};