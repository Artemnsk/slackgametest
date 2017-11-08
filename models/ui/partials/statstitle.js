"use strict";

module.exports = getStatsTitle;

function getStatsTitle(hp, mana, gold) {
    return {
        text: `:heart:${hp}/40 :large_blue_diamond:${mana}/30 :moneybag:${gold}`,
        color: "#950001",
        callback_id: "/mainmenu",
        attachment_type: "default"
    };
}