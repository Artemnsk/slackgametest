"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spellbook':
      return uiRouter.spellbookUIRoute().getUIMessage(uiRouter, {});
      break;
    case 'shop':
      return uiRouter.shopUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  return mainMenuFactory(30, 40, 402);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;