"use strict";

const Route = require('route-parser');
const spellFactory = require('../uimessage/factory/spellfactory');

function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  // Parse submitted actions to know which window to render.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.spellbookUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  return spellFactory(20, 22, 1234, args.spellName);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook/:spellName'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};