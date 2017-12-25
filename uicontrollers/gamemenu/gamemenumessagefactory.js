"use strict";

const UIMessage = require('../../models/uimessage/uimessage');

/**
 * Provides with game menu UI element.
 * @param {string} callback_id
 * @return {UIMessage}
 */
function gameMenuFactory(callback_id) {
  const breakMenuUIMessage = new UIMessage();
  let uiAttachments = [];
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