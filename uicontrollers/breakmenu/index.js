"use strict";

const Route = require('route-parser');
const breakMenuMessageFactory = require('./breakmenumessagefactory');
const CHANNEL_PHASES = require('../../models/channel/channel').CHANNEL_PHASES;

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
  let uiMessage = breakMenuMessageFactory(uiRouter.breakmenuUIRoute.route.reverse({}), uiRouter.channel, uiRouter.player);
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
  let validateRoute = new Route('/breakmenu/*');
  if (validateRoute.match(path)) {
    if (!uiRouter.player) {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
    } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
    }
  }
  return null;
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};