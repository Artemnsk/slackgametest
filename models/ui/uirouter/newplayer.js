"use strict";

const Route = require('route-parser');
const newPlayerFactory = require('../uimessage/factory/newplayerfactory');

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'option':
      switch (action.value) {
        case 'no':
          // TODO: 'removal-signal' message.
          break;
        case 'yes':
          // TODO: create player!
          break;
      }
  }
  return null;
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  return newPlayerFactory();
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/newplayer'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;