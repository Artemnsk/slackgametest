"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
const gameTitleFactory = require('../_partials/gametitlefactory');
const /** @type Array<Spell> */ spells = require('../../storage/spells/spells');

/**
 * Provides with game menu UI element.
 * @param {string} callback_id
 * @param {?Gamer} gamer
 * @param {Array<Spell>} gamerSpells
 * @return {UIMessage}
 */
function gameMenuFactory(callback_id, gamer, gamerSpells) {
  const gameMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  if (!gamer) {
    // Non-gamer menu.
    uiAttachments.push(gameTitleFactory(callback_id, gamer));
  } else if (gamer.dead === true) {
    // Dead gamer menu.
    uiAttachments.push(gameTitleFactory(callback_id, gamer));
    uiAttachments.push(_getSpells(callback_id, gamerSpells));
  } else {
    // Default game menu.
    uiAttachments.push(gameTitleFactory(callback_id, gamer));
    uiAttachments.push(_getSpells(callback_id, gamerSpells));
  }
  let bottomMenu = {
    text: '',
    color: "#950001",
    callback_id,
    attachment_type: "default",
    actions: [{
      name: "navigation",
      text: ":man-woman-girl-boy: Stats",
      type: "button",
      value: 'stats'
    }]
  };
  uiAttachments.push(bottomMenu);
  gameMenuUIMessage.setUIAttachments(uiAttachments);
  return gameMenuUIMessage;
}

/**
 *
 * @param {string} callback_id
 * @param {Array<Spell>} gamerSpells
 * @return Object
 * @private
 */
function _getSpells(callback_id, gamerSpells) {
  let actions = gamerSpells.map(item => {
      return {
        name: "spell",
        text: item.emoji,
        type: "button",
        value: item.id
      };
  });
  return {
    text: actions.length > 0 ? "*Spells*" : "*No spells available*",
    color: "#a333a1",
    callback_id,
    attachment_type: "default",
    actions
  };
}

module.exports = gameMenuFactory;