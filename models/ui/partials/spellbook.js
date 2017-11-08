"use strict";

const spells = require('../../../storage/spells/spells');

module.exports = getSpells;

function getSpells(callback_id) {
    let attachment = {
        color: "#a333a1",
        callback_id: callback_id,
        attachment_type: "default"
    };
    var actions = [];
    for (let i = 0; i < spells.length; i++) {
        actions.push({
            name: "spell",
            text: spells[i].emoji,
            type: "button",
            value: spells[i].id
        });
    }
    if (actions.length > 0) {
        attachment.text = "*Spells*";
        attachment.actions = actions;
    } else {
        attachment.text = "*No spells available*";
    }
    return attachment;
}