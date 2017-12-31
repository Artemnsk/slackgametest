"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
const breakTitleFactory = require('../_partials/breaktitlefactory');

/**
 * Provides with main menu UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Player} player
 * @return {UIMessage}
 */
function breakMenuFactory(callback_id, channel, player) {
  const breakMenuUIMessage = new UIMessage();
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callback_id, channel, player));
  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
    actions: [
      {
        name: "spellbook",
        text: ":sparkles:Spellbook",
        type: "button",
        value: "spellbook"
      }, {
        name: "shop",
        text: ":scales:Shop",
        type: "button",
        value: "shop"
      }
    ]
  });
  breakMenuUIMessage.setUIAttachments(uiAttachments);
  return breakMenuUIMessage;
}

module.exports = breakMenuFactory;