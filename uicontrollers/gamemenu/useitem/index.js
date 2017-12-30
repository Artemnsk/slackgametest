"use strict";

const Route = require('route-parser');
const /** @type Array<Item> */ items = require('../../../storage/items/items');
const useItemMessageFactory = require('./useitemmessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{ itemId: string }} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // Delegate that to spell now.
  const item = items.find(currentItem => currentItem.id === args.itemId);
  let itemBeingProcessedPromise = item.processUsageForm(uiRouter.game, uiRouter.gamer, parsedPayload);
  return itemBeingProcessedPromise
    .then((processed) => {
      if (processed) {
        return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      } else {
        // ..proceed with other checks. Currently no other checks.
        // TODO: error?
        return null;
      }
    }, (err) => {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: `Error: Something went wrong. ${err.message}` });
    });
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{ itemId: string }} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  const item = items.find(currentItem => currentItem.id === args.itemId);
  return Promise.resolve(useItemMessageFactory(uiRouter.useItemUIRoute.route.reverse(args), uiRouter.channel, uiRouter.game, uiRouter.gamer, item));
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {string} path
 * @param {ParsedSlackActionPayload} [parsedPayload]
 * @return ?UIMessage
 */
function validateRoute(uiRouter, path, parsedPayload) {
  let validateRoute = new Route('/gamemenu/useitem/:itemId/*');
  let args;
  if (args = validateRoute.match(path)) {
    if (!uiRouter.gamer) {
      let text = 'Error: You are not participate in this game.';
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    } else if (!items.find(item => item.id === args.itemId)) {
      let text = "Error: item with this item ID doesn't exist.";
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    } else if (!uiRouter.gamer.items || uiRouter.gamer.items[args.itemId] !== true) {
      let text = 'Error: You have no this item.';
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
  }
  return null;
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu/useitem/:itemId'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};