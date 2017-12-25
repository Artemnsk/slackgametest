"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const breakTitleFactory = require('../../_partials/breaktitlefactory');

/**
 * Provides with shop UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Player} player
 * @return {UIMessage}
 */
function shopFactory(callback_id, channel, player) {
  const shopUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callback_id, channel, player));
  uiAttachments.push({
    text: "*Shop*",
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
    actions: [
      {
        name: "back",
        text: ":back:",
        type: "button",
        value: "back"
      }
    ]
  });
  shopUIMessage.setUIAttachments(uiAttachments);
  return shopUIMessage;
}

module.exports = shopFactory;