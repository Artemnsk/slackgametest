"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return mainMenuFactory(30, 40, 402);
      break;
  }
  return null;
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/shop'),
  processActions
};

module.exports = uiRoute;