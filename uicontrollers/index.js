"use strict";

const Route = require('route-parser');
const CHANNEL_PHASES = require('../models/channel/channel').CHANNEL_PHASES;

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {Function} processActions
 * @property {Function} getUIMessage
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
      let uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
      return uiMessage;
      break;
  }
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};