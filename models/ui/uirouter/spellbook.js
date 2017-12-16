"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');
const spellFactory = require('../uimessage/factory/spellfactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spell':
      return spellFactory(20, 22, 1234, action.value);
      break;
    case 'back':
      return mainMenuFactory(20, 22, 1230);
      break;
  }
  return null;
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook'),
  processActions
};

module.exports = uiRoute;