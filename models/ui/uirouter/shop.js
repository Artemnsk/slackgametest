"use strict";

const Route = require('route-parser');
const shopFactory = require('../uimessage/factory/shopfactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  return shopFactory(20, 20, 321);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/shop'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;