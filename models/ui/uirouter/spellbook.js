"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');
const spellFactory = require('../uimessage/factory/spellfactory');

module.exports = {
    route: new Route('/mainmenu/spellbook'),
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
        case 'spell':
            return spellFactory(actionData.original_message.ts, 20, 22, 1234, action.value);
            // var uiMessage = new UIMessage();
            // var uiAttachments = [];
            // uiAttachments.push(statisticsTitle(40, 30, 432));
            // // Get spell and display info.
            // var spell;
            // for (let i = 0; i < spells.length; i++) {
            //     if (action.value == spells[i].id) {
            //         spell = spells[i];
            //     }
            // }
            // uiAttachments.push({
            //     author_name: `${spell.emoji}${spell.label}`,
            //     fields: spell.getInfo(),
            //     color: "#3AA3E3",
            //     attachment_type: "default",
            //     callback_id: "/mainmenu/spellbook/spellinfo",
            // });
            // uiAttachments.push({
            //     text: '',
            //     color: "#3AA3E3",
            //     attachment_type: "default",
            //     callback_id: "/mainmenu/spellbook/spellinfo",
            //     actions: [
            //         {
            //             name: "back",
            //             text: ":back:",
            //             type: "button",
            //             value: "back"
            //         }
            //     ]
            // });
            // uiMessage.setUIAttachments(uiAttachments);
            // var sendParameters = {
            //     method: 'chat.update',
            //     as_user: true,
            //     ts: actionData.original_message.ts,
            //     icon_url: "http://lorempixel.com/48/48",
            //     channel: privateCredentials.sandboxChannelId
            // };
            // uiMessage.setSendParameters(sendParameters);
            // return uiMessage;
            break;
        case 'back':
            return mainMenuFactory(actionData.original_message.ts, 20, 22, 1230);
            break;
    }
    return null;
}