"use strict";

const Route = require('route-parser');
const breakMenuFactory = require('../uimessage/factory/breakmenufactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {UIMessage}
 */
function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spellbook':
      return uiRouter.spellbookUIRoute().getUIMessage(uiRouter, {});
      break;
    case 'shop':
      return uiRouter.shopUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  }
  return breakMenuFactory(30, 40, 402);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};