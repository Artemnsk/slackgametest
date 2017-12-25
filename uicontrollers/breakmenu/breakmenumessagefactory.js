"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
const statsTitleFactory = require('../_partials/statstitlefactory');

/**
 * Provides with main menu UI element.
 * @param {string} callback_id
 * @return {UIMessage}
 */
function breakMenuFactory(callback_id, hp, mp, gold) {
  const breakMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mp, gold));
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