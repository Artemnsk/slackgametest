const RawAction = require('../../models/rawaction/rawaction').RawAction;
const RAW_ACTION_TYPES = require('../../models/rawaction/rawaction').RAW_ACTION_TYPES;

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
   *
   * @param {Gamer} gamer
   * @return boolean|string
   */
  validateGamerCast(gamer) {
    if (gamer.dead === true) {
      return 'You are dead.';
    } else {
      // TODO: there is first extension for mana and mana-free spells.
      if (gamer.spells && gamer.spells[this.id] === true) {
        if (!this.params.manacost || gamer.mana >= this.params.manacost) {
          return true;
        } else {
          return 'You have not enough mana.';
        }
      } else {
        return 'You have no this spell.';
      }
    }
  }

  /**
   * Returns select Action for uiAttachment with non-dead gamers (even with empty opts).
   * @param {string} callback_id
   * @param {Game} game
   * @param {Gamer} gamer
   * @return ?Object
   */
  getCastForm(callback_id, game, gamer) {
    if (this.validateGamerCast(gamer) === true) {
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
    } else {
      // TODO: display 'not enough mana' somehow.
      return null;
    }
  }

  /**
   * If promise resolved to false it means that it is simply non-spell action.
   * But if promise being rejected it means that we really wanted to process cast form but error appeared.
   *
   * @param {Game} game
   * @param {Gamer} gamer
   * @param {ParsedSlackActionPayload} parsedPayload
   * @return Promise<boolean,Error>
   */
  processCastForm(game, gamer, parsedPayload) {
    let action = parsedPayload.actions[0];
    switch (action.name) {
      case 'target':
        if (this.validateGamerCast(gamer) === true) {
          let targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
          if (targetKey) {
            let /** @type RawActionFirebaseValue */ rawActionFirebaseValue = {
              type: RAW_ACTION_TYPES.CAST_SPELL,
              target: targetKey,
              initiator: gamer.$key,
              params: {
                spellId: this.id
              }
            };
            return RawAction.addRawAction(rawActionFirebaseValue, game.$teamKey, game.$channelKey, game.$key)
              .then(() => Promise.resolve(true));
          }
        }
        return Promise.resolve(false);
        break;
    }
    return Promise.resolve(false);
  }
}

module.exports = {
  Spell
};