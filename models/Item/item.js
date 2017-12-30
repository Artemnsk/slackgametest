const RawAction = require('../../models/rawaction/rawaction').RawAction;
const RAW_ACTION_TYPES = require('../../models/rawaction/rawaction').RAW_ACTION_TYPES;

/**
 * @typedef {Object} ItemData
 * @property {string} emoji
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} consumable
 * @property {?number} quantity
 * @property {Object} [params]
 */

/**
 *
 */
class Item {
  /**
   *
   * @param {ItemData} itemData
   * @constructor
   * @extends ItemData
   */
  constructor(itemData) {
    this.emoji = itemData.emoji;
    this.id = itemData.id;
    this.label = itemData.label;
    this.description = itemData.description;
    this.params = itemData.params;
    this.consumable = itemData.consumable;
    this.quantity = this.consumable ? itemData.quantity : null;
  }

  getInfo() {
    return [
      {
        title: "Description",
        value: this.description,
        short: false
      }
    ];
  }

  /**
   *
   * @param {Gamer} gamer
   * @return boolean|string
   */
  validateGamerUsage(gamer) {
    if (gamer.dead === true) {
      return 'You are dead.';
    } else {
      // TODO: there is first extension for mana and mana-free spells.
      if (gamer.items && gamer.items[this.id] === true) {
        if (!this.params.manacost || gamer.mana >= this.params.manacost) {
          return true;
        } else {
          return 'You have not enough mana.';
        }
      } else {
        return 'You have no this item.';
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
  getUsageForm(callback_id, game, gamer) {
    if (this.validateGamerUsage(gamer) === true) {
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
   * But if promise being rejected it means that we really wanted to process usage form but error appeared.
   *
   * @param {Game} game
   * @param {Gamer} gamer
   * @param {ParsedSlackActionPayload} parsedPayload
   * @return Promise<boolean,Error>
   */
  processUsageForm(game, gamer, parsedPayload) {
    let action = parsedPayload.actions[0];
    switch (action.name) {
      case 'target':
        if (this.validateGamerUsage(gamer) === true) {
          let targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
          if (targetKey) {
            let /** @type RawActionFirebaseValue */ rawActionFirebaseValue = {
              type: RAW_ACTION_TYPES.USE_ITEM,
              target: targetKey,
              initiator: gamer.$key,
              params: {
                itemId: this.id
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
  Item
};