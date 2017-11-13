"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');

module.exports = {
    route: new Route('/mainmenu/spellbook/spellinfo'),
    callback: routeCallback
};

/**
 * @param {Object} actionData - payload action data.
 * @param {Object} args - arguments for this UI route retrieved from route path.
 * @return {null|UIMessage}
 */
function routeCallback(actionData, args) {
    // Parse submitted actions to know which window to render.
    let action = actionData.actions[0];
    switch (action.name) {
        case 'back':
            return spellBookFactory(actionData.original_message.ts, 20, 20, 321);
            break;
    }
    return null;
}