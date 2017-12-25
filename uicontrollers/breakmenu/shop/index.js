"use strict";

const Route = require('route-parser');
const shopMessageFactory = require('./shopMessagefactory');

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
  }
  let uiMessage = shopMessageFactory(uiRouter.shopUIRoute.route.reverse({}), 20, 20, 321);
  return Promise.resolve(uiMessage);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/shop'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};