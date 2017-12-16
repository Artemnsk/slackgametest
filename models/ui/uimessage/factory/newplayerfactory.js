"use strict";

const UIMessage = require('../uimessage');

/**
 * Provides with new player UI element.
 * @return {UIMessage}
 */
function newPlayerFactory() {
  const newPlayerUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push({
    text: 'You have no player in this game yet. Do you want to create new one?',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/newplayer",
    actions: [
      {
        name: "option",
        text: "No",
        type: "button",
        value: "no"
      }, {
        name: "option",
        text: "Yes",
        type: "button",
        value: "yes"
      }
    ]
  });
  newPlayerUIMessage.setUIAttachments(uiAttachments);
  return newPlayerUIMessage;
}

module.exports = newPlayerFactory;