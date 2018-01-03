"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../models/uimessage/uimessage");
const CREATE_NEW_PLAYER_YES = "yes";
/**
 * Provides with new player UI element.
 */
function newPlayerMessageFactory(callbackId) {
    const newPlayerUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push({
        actions: [
            {
                name: "option",
                text: "Create new player!",
                type: "button",
                value: CREATE_NEW_PLAYER_YES,
            },
        ],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#3AA3E3",
        text: "You have no player in this game yet. Do you want to create new one?",
    });
    newPlayerUIMessage.setUIAttachments(uiAttachments);
    return newPlayerUIMessage;
}
exports.newPlayerMessageFactory = newPlayerMessageFactory;
//# sourceMappingURL=newplayermessagefactory.js.map