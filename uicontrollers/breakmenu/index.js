"use strict";

const Route = require('route-parser');
const breakMenuMessageFactory = require('./breakmenumessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spellbook':
      return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
      break;
    case 'shop':
      return uiRouter.shopUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  }
  let uiMessage = breakMenuMessageFactory(uiRouter.breakmenuUIRoute.route.reverse({}), 30, 40, 402);
  return Promise.resolve(uiMessage);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};