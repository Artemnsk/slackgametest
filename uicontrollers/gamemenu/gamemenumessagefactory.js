"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
const gameTitleFactory = require('../_partials/gametitlefactory');
const /** @type Array<Spell> */ spells = require('../../storage/spells/spells');

/**
 * Provides with game menu UI element.
 * @param {string} callback_id
 * @param {?Gamer} gamer
 * @return {UIMessage}
 */
function gameMenuFactory(callback_id, gamer) {
  const gameMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  let gamerSpellActions = _getSpellActions(callback_id, gamer);
  let gametItemActions = _getItemActions(callback_id, gamer);
  let gamerActions = gamerSpellActions.concat(gametItemActions);
  let gamerActionsAttachment = {
    text: gamerActions.length > 0 ? "*Available actions*" : "*Nothing to use*",
    color: "#a333a1",
    callback_id,
    attachment_type: "default",
    actions: gamerActions
  };
  if (!gamer) {
    // Non-gamer menu.
    uiAttachments.push(gameTitleFactory(callback_id, gamer));
  } else {
    // Both Dead gamer menu and Default game menu.
    uiAttachments.push(gameTitleFactory(callback_id, gamer));
    uiAttachments.push(gamerActionsAttachment);
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
 * @param {Gamer} gamer
 * @return Array<Object>
 * @private
 */
function _getSpellActions(callback_id, gamer) {
  let gamerSpells = gamer.getSpells();
  return gamerSpells.map(item => {
      return {
        name: "spell",
        text: item.emoji,
        type: "button",
        value: item.id
      };
  });
}

/**
 *
 * @param {string} callback_id
 * @param {Gamer} gamer
 * @return Array<Object>
 * @private
 */
function _getItemActions(callback_id, gamer) {
  let gamerSpells = gamer.getItems();
  return gamerSpells.map(item => {
      return {
        name: "item",
        text: item.emoji,
        type: "button",
        value: item.id
      };
  });
}

module.exports = gameMenuFactory;