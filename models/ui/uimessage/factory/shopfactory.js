"use strict";

const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');

/**
 * Provides with shop UI element.
 * @return {UIMessage}
 */
function shopFactory(hp, mana, gold) {
  const shopUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mana, gold));
  uiAttachments.push({
    text: "*Shop*",
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/breakmenu/shop",
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