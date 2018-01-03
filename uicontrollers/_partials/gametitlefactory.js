"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function gameTitleFactory(callbackId, gamer) {
    if (!gamer) {
        return {
            attachment_type: "default",
            callback_id: callbackId,
            color: "#950001",
            text: `you're not participate in this game`,
        };
    }
    else if (gamer.dead === true) {
        return {
            attachment_type: "default",
            callback_id: callbackId,
            color: "#950001",
            text: `you're dead`,
        };
    }
    else {
        return {
            attachment_type: "default",
            callback_id: callbackId,
            color: "#950001",
            text: `:heart:${gamer.health} :large_blue_diamond:${gamer.mana}`,
        };
    }
}
exports.gameTitleFactory = gameTitleFactory;
//# sourceMappingURL=gametitlefactory.js.map