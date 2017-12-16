"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {UIRouteProcessActions} processActions
 * @property {UIRouteGetUIMessage} getUIMessage
 */

/**
 * @callback UIRouteProcessActions
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {Object} args
 * @return {UIMessage}
 */

/**
 * @callback UIRouteGetUIMessage
 * @param {UIRouter} uiRouter
 * @param {Object} args
 * @return {UIMessage}
 */

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // TODO: from commands parsedpayload is empty.
  if (!parsedPayload || !parsedPayload.actions || parsedPayload.actions.length === 0) {
    return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
  }
  // TODO: detect game phase and respond with appropriate UI.
  return mainMenuFactory(20, 30, 123);
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  processActions,
  getUIMessage
};

module.exports = uiRoute;