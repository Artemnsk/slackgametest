"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {UIRouteGetUIMessage} getUIMessage
 */

/**
 * @callback UIRouteGetUIMessage
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * // TODO: check that.
 * @return {UIMessage}
 */

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, parsedPayload) => {
  // TODO: detect game phase and respond with appropriate UI.
  return mainMenuFactory(20, 30, 123);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  getUIMessage
};

module.exports = uiRoute;