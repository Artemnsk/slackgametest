"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../models/uimessage/uimessage");
const gametitlefactory_1 = require("../../_partials/gametitlefactory");
/**
 * Provides with spell UI element.
 */
function useItemMessageFactory(callbackId, channel, game, gamer, item) {
    const useItemUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [gametitlefactory_1.gameTitleFactory(callbackId, gamer), ...item.getSlackInfo(callbackId)];
    // TODO: delegate that to validator?
    if (gamer.dead === true) {
        const footerUIAttachment = {
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
        uiAttachments.push(footerUIAttachment);
    }
    else {
        const validateItem = item.validateGamerUsage(gamer);
        const footerUIAttachment = {
            attachment_type: "default",
            callback_id: callbackId,
            color: "#1E09C9",
            text: validateItem === true ? "" : validateItem,
        };
        const backButton = {
            name: "back",
            text: ":back:",
            type: "button",
            value: "back",
        };
        footerUIAttachment.actions = [backButton];
        const useItemAction = item.getUsageForm(callbackId, game, gamer);
        if (useItemAction) {
            footerUIAttachment.actions.push(useItemAction);
        }
        uiAttachments.push(footerUIAttachment);
    }
    useItemUIMessage.setUIAttachments(uiAttachments);
    return useItemUIMessage;
}
exports.useItemMessageFactory = useItemMessageFactory;
//# sourceMappingURL=useitemmessagefactory.js.map