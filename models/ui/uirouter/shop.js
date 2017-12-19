"use strict";

const Route = require('route-parser');
const shopFactory = require('../uimessage/factory/shopfactory');

function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

/**
 *
 * @param {UIRoute} uiRouter
 * @param {Object} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  return shopFactory(20, 20, 321);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/shop'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};