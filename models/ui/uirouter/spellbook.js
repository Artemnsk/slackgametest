"use strict";

const Route = require('route-parser');
const spellBookFactory = require('../uimessage/factory/spellbookfactory');

function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
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
}

function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  return spellBookFactory(20, 20, 321);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/mainmenu/spellbook'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};