"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
// TODO: import this variable from uirouter/newplayer.
const CREATE_NEW_PLAYER_YES = 'yes';

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
        text: "Create new player!",
        type: "button",
        value: CREATE_NEW_PLAYER_YES
      }
    ]
  });
  newPlayerUIMessage.setUIAttachments(uiAttachments);
  return newPlayerUIMessage;
}

module.exports = newPlayerFactory;