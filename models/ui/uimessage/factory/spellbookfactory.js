"use strict";

const privateCredentials = require('../../../../credentials/private');
const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');
const spells = require('../../../../storage/spells/spells');

function _getSpells() {
    let attachment = {
        color: "#a333a1",
        callback_id: '/mainmenu/spellbook',
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

/**
 * Provides with spellbook UI element.
 * @param {number} ts
 * @return {UIMessage}
 */
function spellBookFactory(ts, hp, mana, gold) {
    const spellBookUIMessage = new UIMessage();
    let uiAttachments = [];
    uiAttachments.push(statsTitleFactory(hp, mana, gold));
    uiAttachments.push(_getSpells());
    uiAttachments.push({
        text: '',
        color: "#3AA3E3",
        attachment_type: "default",
        callback_id: "/mainmenu/spellbook",
        actions: [
            {
                name: "back",
                text: ":back:",
                type: "button",
                value: "back"
            }
        ]
    });
    spellBookUIMessage.setUIAttachments(uiAttachments);
    let sendParameters = {
        method: 'chat.update',
        as_user: true,
        ts: ts,
        icon_url: "http://lorempixel.com/48/48",
        channel: privateCredentials.sandboxChannelId
    };
    spellBookUIMessage.setSendParameters(sendParameters);
    return spellBookUIMessage;
}

module.exports = spellBookFactory;