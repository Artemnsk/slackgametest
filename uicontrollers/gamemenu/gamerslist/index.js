"use strict";

const Route = require('route-parser');
const /** @type Array<Spell> */ spells = require('../../../storage/spells/spells');
const gamersListMessageFactory = require('./gamerslistmessagefactory');

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
    case 'navigation':
      switch (action.value) {
        case 'back':
          return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
          break;
      }
      break;
  }
  // TODO: error
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  return Promise.resolve(gamersListMessageFactory(uiRouter.gamersListUIRoute.route.reverse(args), uiRouter.game, uiRouter.gamer));
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
  route: new Route('/gamemenu/gamerslist'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};