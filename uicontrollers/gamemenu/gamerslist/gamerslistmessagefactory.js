"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uimessage_1 = require("../../../models/uimessage/uimessage");
const gametitlefactory_1 = require("../../_partials/gametitlefactory");
/**
 * Provides with spell UI element.
 */
function gamersListMessageFactory(callbackId, game, gamer) {
    const gamersListUIMessage = new uimessage_1.UIMessage();
    const uiAttachments = [];
    uiAttachments.push(gametitlefactory_1.gameTitleFactory(callbackId, gamer));
    const gamers = [];
    for (const gamerKey in game.gamers) {
        if (game.gamers.hasOwnProperty(gamerKey)) {
            const currentGamer = game.getGamer(gamerKey);
            if (currentGamer !== null) {
                gamers.push(currentGamer);
            }
        }
    }
    gamers.sort((a, b) => a.dead && !b.dead ? 1 : -1);
    let gamersListText = "";
    gamers.map((item) => gamersListText += `${item.getGameStats()}\n`);
    // TODO: group them by 5 items per attachment. Otherwise we will have show more text.
    const gamersListUIAttachments = {
        actions: [{
                name: "navigation",
                text: ":back:",
                type: "button",
                value: "back",
            }],
        attachment_type: "default",
        callback_id: callbackId,
        color: "#1E09C9",
        mrkdwn_in: ["text"],
        text: gamersListText,
    };
    uiAttachments.push(gamersListUIAttachments);
    gamersListUIMessage.setUIAttachments(uiAttachments);
    return gamersListUIMessage;
}
exports.gamersListMessageFactory = gamersListMessageFactory;
//# sourceMappingURL=gamerslistmessagefactory.js.map