"use strict";

const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');

/**
 * Provides with main menu UI element.
 * @return {UIMessage}
 */
function mainMenuFactory(hp, mp, gold) {
  const mainMenuUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mp, gold));
  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/mainmenu",
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
  mainMenuUIMessage.setUIAttachments(uiAttachments);
  return mainMenuUIMessage;
}

module.exports = mainMenuFactory;