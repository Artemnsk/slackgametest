"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../models/uimessage/uimessage");
const breaktitlefactory_1 = require("../../_partials/breaktitlefactory");
/**
 * Provides with shop UI element.
 */
function shopMessageFactory(callbackId, channel, player) {
    const shopUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push(breaktitlefactory_1.breakTitleFactory(callbackId, channel, player));
    uiAttachments.push({
        actions: [
            {
                name: "back",
                text: ":back:",
                type: "button",
                value: "back",
            },
        ],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#3AA3E3",
        text: "*Shop*",
    });
    shopUIMessage.setUIAttachments(uiAttachments);
    return shopUIMessage;
}
exports.shopMessageFactory = shopMessageFactory;
//# sourceMappingURL=shopMessagefactory.js.map