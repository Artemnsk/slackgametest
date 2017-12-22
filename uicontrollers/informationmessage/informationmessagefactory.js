"use strict";

const UIMessage = require('../../models/uimessage/uimessage');
// That is used as name and value for 'ok' button.
const INFORMATION_MESSAGE_OK = 'ok';

/**
 * Provides with information UI element.
 * @param {string} text
 * @param {string} callback_id
 * @param {string} buttonText
 * @return {UIMessage}
 */
function informationMessageFactory(text, callback_id, buttonText) {
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
        text: buttonText,
        type: "button",
        value: INFORMATION_MESSAGE_OK
      }
    ]
  });
  informationMessageUIMessage.setUIAttachments(uiAttachments);
  return informationMessageUIMessage;
}

module.exports = {
  informationMessageFactory,
  INFORMATION_MESSAGE_OK
};