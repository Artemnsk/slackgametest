"use strict";

const Route = require('route-parser');
const gameMenuFactory = require('../uimessage/factory/gamemenufactory');
const CHANNEL_PHASES = require('../../channel/channel').CHANNEL_PHASES;

const castSpellFactory = require('../uimessage/factory/castspellfactory');

function processActions(uiRouter, parsedPayload, args) {
  var a = 1;
  return gameMenuFactory('/gamemenu');
  // TODO:
  // return {
  //
  // };
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {Object} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  // return castSpellFactory(1, 2, 3, 'fireball');
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