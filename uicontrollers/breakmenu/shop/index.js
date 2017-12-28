"use strict";

const Route = require('route-parser');
const shopMessageFactory = require('./shopMessagefactory');
const CHANNEL_PHASES = require('../../../models/channel/channel').CHANNEL_PHASES;

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // TODO:
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  // uiRouter.channel.startGame();
  // uiRouter.channel.overGame();
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
  }
  let uiMessage = shopMessageFactory(uiRouter.shopUIRoute.route.reverse({}), uiRouter.channel, uiRouter.player);
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
  route: new Route('/breakmenu/shop'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};