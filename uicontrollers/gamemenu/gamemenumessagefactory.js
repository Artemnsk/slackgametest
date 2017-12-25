"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
const gameTitleFactory = require('../_partials/gametitlefactory');

/**
 * Provides with game menu UI element.
 * @param {string} callback_id
 * @param {Gamer} gamer
 * @return {UIMessage}
 */
function gameMenuFactory(callback_id, gamer) {
  const breakMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(gameTitleFactory(callback_id, gamer));
  uiAttachments.push({
    text: 'IN_GAME MENU',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
  });
  breakMenuUIMessage.setUIAttachments(uiAttachments);
  return breakMenuUIMessage;
}

module.exports = gameMenuFactory;