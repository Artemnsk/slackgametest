"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const statsTitleFactory = require('../../_partials/statstitlefactory');

/**
 * Provides with shop UI element.
 * @param {string} callback_id
 * @return {UIMessage}
 */
function shopFactory(callback_id, hp, mana, gold) {
  const shopUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mana, gold));
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