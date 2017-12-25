"use strict";

const Route = require('route-parser');
const gameMenuMessageFactory = require('./gamemenumessagefactory');
const CHANNEL_PHASES = require('../../models/channel/channel').CHANNEL_PHASES;

const castSpellFactory = require('./castspell/castspellmessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
  // TODO:
  // return {
  //
  // };
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  // return castSpellFactory(1, 2, 3, 'fireball');
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
    return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
  }
  let uiMessage = gameMenuMessageFactory(uiRouter.gamemenuUIRoute.route.reverse({}), uiRouter.gamer);
  return Promise.resolve(uiMessage);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};