"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const daySizeMs = 24 * 60 * 60 * 1000;
function breakTitleFactory(callbackId, channel, player) {
    const nextGameInfo = channel.nextGame ? `Next game in ${_getNextGameTime(channel.nextGame)}` : "";
    return {
        attachment_type: "default",
        callback_id: callbackId,
        color: "#950001",
        text: `:moneybag:${player.gold} ${nextGameInfo}`,
    };
}
exports.breakTitleFactory = breakTitleFactory;
function _getNextGameTime(timestampMs) {
    const difference = timestampMs - Date.now();
    if (difference < 0) {
        return "..now!";
    }
    else if (difference > daySizeMs) {
        return "> 1 day";
    }
    else {
        const date = moment(difference).utc(false);
        return date.format("H:mm:ss");
    }
}
//# sourceMappingURL=breaktitlefactory.js.map