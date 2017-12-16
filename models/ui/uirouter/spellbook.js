"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spell':
      return uiRouter.spellinfoUIRoute().getUIMessage(uiRouter, { spellName: action.value });
      break;
    case 'back':
      return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  return spellBookFactory(20, 20, 321);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;