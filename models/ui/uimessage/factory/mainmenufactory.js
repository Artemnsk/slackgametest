"use strict";

const privateCredentials = require('../../../../credentials/private');
const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');

/**
 * Provides with main menu UI element.
 * @param {number} ts
 * @return {UIMessage}
 */
function mainMenuFactory(ts, hp, mp, gold) {
    const mainMenuUIMessage = new UIMessage();
    let uiAttachments = [];
    uiAttachments.push(statsTitleFactory(hp, mp, gold));
    uiAttachments.push({
        text: '',
        color: "#3AA3E3",
        attachment_type: "default",
        callback_id: "/mainmenu",
        actions: [
            {
                name: "spellbook",
                text: ":sparkles:Spellbook",
                type: "button",
                value: "spellbook"
            }, {
                name: "shop",
                text: ":scales:Shop",
                type: "button",
                value: "shop"
            }
        ]
    });
    mainMenuUIMessage.setUIAttachments(uiAttachments);
    let sendParameters = {
        method: 'chat.update',
        as_user: true,
        ts: ts,
        icon_url: "http://lorempixel.com/48/48",
        channel: privateCredentials.sandboxChannelId
    };
    mainMenuUIMessage.setSendParameters(sendParameters);
    return mainMenuUIMessage;
}

module.exports = mainMenuFactory;