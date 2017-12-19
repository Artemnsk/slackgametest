"use strict";

const Route = require('route-parser');
const shopFactory = require('../uimessage/factory/shopfactory');
const informationMessageFactory = require('../uimessage/factory/informationmessagefactory');

const INFORMATION_MESSAGE_OK = 'ok';

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  if (!uiRouter.player) {
    return informationMessageFactory('Error: Cannot find your player.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK);
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
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  if (!uiRouter.player) {
    return informationMessageFactory('Error: Player already exists.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK);
  }
  return shopFactory(20, 20, 321);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/shop'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};