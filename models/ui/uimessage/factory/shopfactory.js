"use strict";

const privateCredentials = require('../../../../credentials/private');
const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');

/**
 * Provides with shop UI element.
 * @param {number} ts
 * @return {UIMessage}
 */
function shopFactory(ts, hp, mana, gold) {
    const shopUIMessage = new UIMessage();
    let uiAttachments = [];
    uiAttachments.push(statsTitleFactory(hp, mana, gold));
    uiAttachments.push({
        text: "*Shop*",
        color: "#3AA3E3",
        attachment_type: "default",
        callback_id: "/mainmenu/shop",
        actions: [
            {
                name: "back",
                text: ":back:",
                type: "button",
                value: "back"
            }
        ]
    });
    shopUIMessage.setUIAttachments(uiAttachments);
    let sendParameters = {
        method: 'chat.update',
        as_user: true,
        ts: ts,
        icon_url: "http://lorempixel.com/48/48",
        channel: privateCredentials.sandboxChannelId
    };
    shopUIMessage.setSendParameters(sendParameters);
    return shopUIMessage;
}

module.exports = shopFactory;