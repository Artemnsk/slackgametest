"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../models/uimessage/uimessage");
const breaktitlefactory_1 = require("../_partials/breaktitlefactory");
/**
 * Provides with main menu UI element.
 */
function breakMenuMessageFactory(callbackId, channel, player) {
    const breakMenuUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push(breaktitlefactory_1.breakTitleFactory(callbackId, channel, player));
    uiAttachments.push({
        actions: [
            {
                name: "spellbook",
                text: ":sparkles:Spellbook",
                type: "button",
                value: "spellbook",
            }, {
                name: "shop",
                text: ":scales:Shop",
                type: "button",
                value: "shop",
            },
        ],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#3AA3E3",
        text: "",
    });
    breakMenuUIMessage.setUIAttachments(uiAttachments);
    return breakMenuUIMessage;
}
exports.breakMenuMessageFactory = breakMenuMessageFactory;
//# sourceMappingURL=breakmenumessagefactory.js.map