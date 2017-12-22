"use strict";

const UIMessage = require('../../models/uimessage/uimessage');

/**
 * Provides with game menu UI element.
 * @return {UIMessage}
 */
function gameMenuFactory(path) {
  const breakMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push({
    text: 'IN_GAME MENU',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: path,
  });
  breakMenuUIMessage.setUIAttachments(uiAttachments);
  return breakMenuUIMessage;
}

module.exports = gameMenuFactory;