"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

module.exports = {
    route: new Route('/mainmenu/shop'),
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
        case 'back':
            return mainMenuFactory(actionData.original_message.ts, 30, 40, 402);
            break;
    }
    return null;
}