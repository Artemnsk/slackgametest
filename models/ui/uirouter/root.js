"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {Function} processActions
 * @property {Function} getUIMessage
 */

function processActions(uiRouter, parsedPayload, args) {
  // TODO: from commands parsedpayload is empty.
  if (!parsedPayload || !parsedPayload.actions || parsedPayload.actions.length === 0) {
    if (!uiRouter.player) {
      return uiRouter.newplayerUIRoute().getUIMessage(uiRouter, {});
    }
    return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
  }

  return mainMenuFactory(20, 30, 123);
}

function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.newplayerUIRoute().getUIMessage(uiRouter, {});
  }
  // TODO: it depends...
  return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};