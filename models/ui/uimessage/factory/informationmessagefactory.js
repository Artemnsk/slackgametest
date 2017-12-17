"use strict";

const UIMessage = require('../uimessage');
const INFORMATION_MESSAGE_OK = 'ok';

/**
 * Provides with information UI element.
 * @return {UIMessage}
 */
function informationMessageFactory(text, callback_id, button_name, button_value) {
  const informationMessageUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push({
    text: text,
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
    actions: [
      {
        name: INFORMATION_MESSAGE_OK,
        text: "Ok",
        type: "button",
        value: INFORMATION_MESSAGE_OK
      }
    ]
  });
  informationMessageUIMessage.setUIAttachments(uiAttachments);
  return informationMessageUIMessage;
}

module.exports = informationMessageFactory;