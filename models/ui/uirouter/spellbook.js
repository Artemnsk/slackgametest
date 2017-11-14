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
            return spellFactory(20, 22, 1234, action.value);
            break;
        case 'back':
            return mainMenuFactory(20, 22, 1230);
            break;
    }
    return null;
}