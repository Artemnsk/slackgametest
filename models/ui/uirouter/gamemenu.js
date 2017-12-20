"use strict";

const Route = require('route-parser');
const gameMenuFactory = require('../uimessage/factory/gamemenufactory');
const CHANNEL_PHASES = require('../../channel/channel').CHANNEL_PHASES;

function processActions(uiRouter, parsedPayload, args) {
  // TODO:
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {Object} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
    return uiRouter.rootUIRoute().getUIMessage(uiRouter, {});
  }
  return gameMenuFactory('/gamemenu');
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};