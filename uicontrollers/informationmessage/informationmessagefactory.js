"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../models/uimessage/uimessage");
// That is used as name and value for "ok" button.
exports.INFORMATION_MESSAGE_OK = "ok";
/**
 * Provides with information UI element.
 */
function informationMessageFactory(callbackId, text, buttonText) {
    const informationMessageUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push({
        actions: [
            {
                name: exports.INFORMATION_MESSAGE_OK,
                text: buttonText,
                type: "button",
                value: exports.INFORMATION_MESSAGE_OK,
            },
        ],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#3AA3E3",
        text,
    });
    informationMessageUIMessage.setUIAttachments(uiAttachments);
    return informationMessageUIMessage;
}
exports.informationMessageFactory = informationMessageFactory;
//# sourceMappingURL=informationmessagefactory.js.map