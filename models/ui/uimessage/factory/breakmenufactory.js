"use strict";

const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');

/**
 * Provides with main menu UI element.
 * @return {UIMessage}
 */
function breakMenuFactory(hp, mp, gold) {
  const breakMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mp, gold));
  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/breakmenu",
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