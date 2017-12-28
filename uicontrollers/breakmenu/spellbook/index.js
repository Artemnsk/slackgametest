"use strict";

const Route = require('route-parser');
const spellbookMessageFactory = require('./spellbookmessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spell':
      return uiRouter.spellinfoUIRoute.getUIMessage(uiRouter, { spellId: action.value });
      break;
    case 'back':
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // TODO: error?
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  let uiMessage = spellbookMessageFactory(uiRouter.spellbookUIRoute.route.reverse({}), uiRouter.channel, uiRouter.player);
  return Promise.resolve(uiMessage);
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {string} path
 * @param {ParsedSlackActionPayload} [parsedPayload]
 * @return ?UIMessage
 */
function validateRoute(uiRouter, path, parsedPayload) {
  return null;
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/spellbook'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};