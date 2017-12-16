"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, parsedPayload) => {
  // Parse submitted actions to know which window to render.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return spellBookFactory(20, 20, 321);
      break;
  }
  return null;
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook/spellinfo'),
  getUIMessage
};

module.exports = uiRoute;