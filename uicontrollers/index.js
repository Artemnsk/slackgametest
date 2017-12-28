"use strict";

const Route = require('route-parser');
const CHANNEL_PHASES = require('../models/channel/channel').CHANNEL_PHASES;

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {Function} processActions
 * @property {Function} getUIMessage
 * @property {Function} validateRoute
 */

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise.<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  // TODO: actually nothing is supposed to be submitted in 'root'.
  // TODO: from commands parsedpayload is empty.
  // if (!parsedPayload || !parsedPayload.actions || parsedPayload.actions.length === 0) {
  //   if (!uiRouter.player) {
  //     return uiRouter.newplayerUIRoute.getUIMessage(uiRouter, {});
  //   }
  //   return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
  // }
  let uiMessage = getUIMessage(uiRouter, {});
  return Promise.resolve(uiMessage);
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise.<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.newplayerUIRoute.getUIMessage(uiRouter, {});
  }
  switch (uiRouter.channel.phase) {
    case CHANNEL_PHASES.BREAK:
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
      break;
    case CHANNEL_PHASES.IN_GAME:
      // TODO: game menu.
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      break;
    default:
      let text = 'Channel is invalid.';
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
      break;
  }
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
  route: new Route('/'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};