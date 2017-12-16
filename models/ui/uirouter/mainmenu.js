"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');
const shopFactory = require('../uimessage/factory/shopfactory');

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, parsedPayload) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spellbook':
      return spellBookFactory(20, 20, 321);
      break;
    case 'shop':
      return shopFactory(20, 20, 321);
      break;
  }
  return null;
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu'),
  getUIMessage
};

module.exports = uiRoute;