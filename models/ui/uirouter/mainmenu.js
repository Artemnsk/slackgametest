"use strict";

const Route = require('route-parser');
const UIMessage = require('../uimessage/uimessage');
const privateCredentials = require('../../../credentials/private');
const statisticsTitle = require('../partials/statstitle');
const spellBookBody = require('../partials/spellbook');

module.exports = {
    route: new Route('/mainmenu'),
    callback: routeCallback
};

/**
 * @param {Object} actionData - payload action data.
 * @param {null|Object} args - arguments for this UI route retrieved from route path. TODO: null or something else?
 * @return {null|UIMessage}
 */
function routeCallback(actionData, args) {
    // Parse submitted actions to know which window to render.
    // TODO:
    let action = actionData.actions[0];
    switch (action.name) {
        case 'spellbook':
            var uiMessage = new UIMessage();
            var uiAttachments = [];
            uiAttachments.push(statisticsTitle(40, 30, 432));
            uiAttachments.push(spellBookBody("/mainmenu/spellbook"));
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
            uiMessage.setUIAttachments(uiAttachments);
            var sendParameters = {
                method: 'chat.update',
                as_user: true,
                ts: actionData.original_message.ts,
                icon_url: "http://lorempixel.com/48/48",
                channel: privateCredentials.sandboxChannelId
            };
            uiMessage.setSendParameters(sendParameters);
            return uiMessage;
            break;
        case 'shop':
            var uiMessage = new UIMessage();
            var uiAttachments = [];
            uiAttachments.push(statisticsTitle(40, 30, 432));
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
            uiMessage.setUIAttachments(uiAttachments);
            var sendParameters = {
                method: 'chat.update',
                as_user: true,
                ts: actionData.original_message.ts,
                icon_url: "http://lorempixel.com/48/48",
                channel: privateCredentials.sandboxChannelId
            };
            uiMessage.setSendParameters(sendParameters);
            return uiMessage;
            break;
    }
    return null;
}