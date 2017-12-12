"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');
const shopFactory = require('../uimessage/factory/shopfactory');

module.exports = {
  route: new Route('/mainmenu'),
  callback: routeCallback
};

/**
 * @param {Object} actionData - payload action data.
 * @param {Object} args - arguments for this UI route retrieved from route path. Empty object if no args passed.
 * @return {null|UIMessage}
 */
function routeCallback(actionData, args) {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = actionData.actions[0];
  switch (action.name) {
    case 'spellbook':
      return spellBookFactory(20, 20, 321);
      break;
    case 'shop':
      return shopFactory(20, 20, 321);
      break;
  }
  return null;
}