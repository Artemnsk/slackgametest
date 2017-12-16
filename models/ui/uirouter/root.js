"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

/**
 * @typedef {Object} UIRoute
 * @property {Route} route
 * @property {UIRouteProcessActions} processActions
 */

/**
 * @callback UIRouteProcessActions
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {Object} args
 * // TODO: check that.
 * @return {UIMessage}
 */

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // TODO: detect game phase and respond with appropriate UI.
  return mainMenuFactory(20, 30, 123);
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  processActions
};

module.exports = uiRoute;