"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../models/uimessage/uimessage");
const gametitlefactory_1 = require("../_partials/gametitlefactory");
/**
 * Provides with game menu UI element.
 */
function gameMenuMessageFactory(callbackId, gamer) {
    const gameMenuUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    const gamerSpellActions = _getSpellActions(callbackId, gamer);
    const gamerItemActions = _getItemActions(callbackId, gamer);
    const gamerActions = gamerSpellActions.concat(gamerItemActions);
    const gamerActionsAttachment = {
        actions: gamerActions,
        attachment_type: "default",
        callback_id: callbackId,
        color: "#a333a1",
        text: gamerActions.length > 0 ? "*Available actions*" : "*Nothing to use*",
    };
    if (!gamer) {
        // Non-gamer menu.
        uiAttachments.push(gametitlefactory_1.gameTitleFactory(callbackId, gamer));
    }
    else {
        // Both Dead gamer menu and Default game menu.
        uiAttachments.push(gametitlefactory_1.gameTitleFactory(callbackId, gamer));
        uiAttachments.push(gamerActionsAttachment);
    }
    const bottomMenu = {
        actions: [{
                name: "navigation",
                text: ":man-woman-girl-boy: Stats",
                type: "button",
                value: "stats",
            }],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#950001",
        text: "",
    };
    uiAttachments.push(bottomMenu);
    gameMenuUIMessage.setUIAttachments(uiAttachments);
    return gameMenuUIMessage;
}
exports.gameMenuMessageFactory = gameMenuMessageFactory;
function _getSpellActions(callbackId, gamer) {
    if (gamer !== null) {
        const gamerSpells = gamer.getSpells();
        return gamerSpells.map((item) => {
            const button = {
                name: "spell",
                text: item.emoji,
                type: "button",
                value: item.id,
            };
            return button;
        });
    }
    else {
        return [];
    }
}
function _getItemActions(callbackId, gamer) {
    if (gamer !== null) {
        const gamerItems = gamer.getItems();
        return gamerItems.map((item) => {
            const button = {
                name: "item",
                text: item.emoji,
                type: "button",
                value: item.id,
            };
            return button;
        });
    }
    else {
        return [];
    }
}
//# sourceMappingURL=gamemenumessagefactory.js.map