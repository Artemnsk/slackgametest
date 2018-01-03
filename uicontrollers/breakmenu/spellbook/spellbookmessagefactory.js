"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../models/uimessage/uimessage");
const spells_1 = require("../../../storage/spells/spells");
const breaktitlefactory_1 = require("../../_partials/breaktitlefactory");
function _getSpells(callbackId) {
    const attachment = {
        actions: [],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#a333a1",
    };
    const actions = [];
    for (let i = 0; i < spells_1.spells.length; i++) {
        actions.push({
            name: "spell",
            text: spells_1.spells[i].emoji,
            type: "button",
            value: spells_1.spells[i].id,
        });
    }
    if (actions.length > 0) {
        attachment.text = "*Spells*";
        attachment.actions = actions;
    }
    else {
        attachment.text = "*No spells available*";
    }
    return attachment;
}
/**
 * Provides with spellbook UI element.
 */
function spellBookMessageFactory(callbackId, channel, player) {
    const spellBookUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push(breaktitlefactory_1.breakTitleFactory(callbackId, channel, player));
    uiAttachments.push(_getSpells(callbackId));
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
    spellBookUIMessage.setUIAttachments(uiAttachments);
    return spellBookUIMessage;
}
exports.spellBookMessageFactory = spellBookMessageFactory;
//# sourceMappingURL=spellbookmessagefactory.js.map