"use strict";

const Route = require('route-parser');
const gameMenuMessageFactory = require('./gamemenumessagefactory');
const /** @type Array<Spell> */ spells = require('../../storage/spells/spells');
const CHANNEL_PHASES = require('../../models/channel/channel').CHANNEL_PHASES;

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spell':
      return uiRouter.castspellUIRoute.getUIMessage(uiRouter, { spellId: action.value });
      break;
    case 'item':
      return uiRouter.useItemUIRoute.getUIMessage(uiRouter, { itemId: action.value });
      break;
    case 'navigation':
      switch (action.value) {
        case 'stats':
          return uiRouter.gamersListUIRoute.getUIMessage(uiRouter, {});
          break;
      }
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
  // Normal game menu.
  let uiMessage = gameMenuMessageFactory(uiRouter.gamemenuUIRoute.route.reverse({}), uiRouter.gamer);
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
  let validateRoute = new Route('/gamemenu/*');
  if (validateRoute.match(path)) {
    if (!uiRouter.player) {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
    } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Wrong game phase.' });
    }
  }
  return null;
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};