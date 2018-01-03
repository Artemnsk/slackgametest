"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../models/uimessage/uimessage");
const gametitlefactory_1 = require("../../_partials/gametitlefactory");
/**
 * Provides with spell UI element.
 */
function castSpellMessageFactory(callbackId, channel, game, gamer, spell) {
    const castSpellUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [gametitlefactory_1.gameTitleFactory(callbackId, gamer), ...spell.getSlackInfo(callbackId)];
    if (gamer.dead === true) {
        const footerUIAttachments = {
            actions: [{
                    name: "back",
                    text: ":back:",
                    type: "button",
                    value: "back",
                }],
            attachment_type: "default",
            callback_id: callbackId,
            color: "#1E09C9",
            text: "",
        };
        uiAttachments.push(footerUIAttachments);
    }
    else {
        const validateSpell = spell.validateGamerCast(gamer);
        const footerUIAttachments = {
            attachment_type: "default",
            callback_id: callbackId,
            color: "#1E09C9",
            text: validateSpell === true ? "" : validateSpell,
        };
        const backButton = {
            name: "back",
            text: ":back:",
            type: "button",
            value: "back",
        };
        footerUIAttachments.actions = [backButton];
        const castSpellAction = spell.getCastForm(callbackId, game, gamer);
        if (castSpellAction) {
            footerUIAttachments.actions.push(castSpellAction);
        }
        uiAttachments.push(footerUIAttachments);
    }
    castSpellUIMessage.setUIAttachments(uiAttachments);
    return castSpellUIMessage;
}
exports.castSpellMessageFactory = castSpellMessageFactory;
//# sourceMappingURL=castspellmessagefactory.js.map