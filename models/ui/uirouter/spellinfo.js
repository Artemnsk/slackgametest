"use strict";

const Route = require('route-parser');
const spellFactory = require('../uimessage/factory/spellfactory');
const informationMessageFactory = require('../uimessage/factory/informationmessagefactory');

const INFORMATION_MESSAGE_OK = 'ok';

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  if (!uiRouter.player) {
    return informationMessageFactory('Error: Cannot find your player.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK);
  }
  // Parse submitted actions to know which window to render.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.spellbookUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  if (!uiRouter.player) {
    return informationMessageFactory('Error: Player already exists.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK);
  }
  return spellFactory(20, 22, 1234, args.spellName);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook/:spellName'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;