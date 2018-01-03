"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../../models/uimessage/uimessage");
const breaktitlefactory_1 = require("../../../_partials/breaktitlefactory");
/**
 * Provides with spell UI element.
 */
function spellInfoMessageFactory(callbackId, channel, player, spell) {
    const spellUIMessage = new uimessage_1.UIMessage();
    let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
    uiAttachments.push(breaktitlefactory_1.breakTitleFactory(callbackId, channel, player));
    uiAttachments = uiAttachments.concat(spell.getSlackInfo(callbackId));
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
        text: "",
    });
    spellUIMessage.setUIAttachments(uiAttachments);
    return spellUIMessage;
}
exports.spellInfoMessageFactory = spellInfoMessageFactory;
//# sourceMappingURL=spellinfomessagefactory.js.map