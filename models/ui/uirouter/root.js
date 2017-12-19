"use strict";

const Route = require('route-parser');
const mainMenuFactory = require('../uimessage/factory/mainmenufactory');

const INFORMATION_MESSAGE_OK = 'ok';

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
 * @return {UIMessage|Promise.<UIMessage,Error>}
 */

/**
 * @callback UIRouteGetUIMessage
 * @param {UIRouter} uiRouter
 * @param {Object} args
 * @return {UIMessage|Promise.<UIMessage,Error>}
 */

const /** @type UIRouteProcessActions */ processActions = (uiRouter, parsedPayload, args) => {
  // TODO: from commands parsedpayload is empty.
  if (!parsedPayload || !parsedPayload.actions || parsedPayload.actions.length === 0) {
    if (!uiRouter.player) {
      return uiRouter.newplayerUIRoute().getUIMessage(uiRouter, {});
    }
    return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
  }
  // TODO: detect game phase and respond with appropriate UI.
  // TODO: PUT THAT INTO SOME HELPER ROUTE.
  // TODO: that is actually bad.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case INFORMATION_MESSAGE_OK:
      switch (action.value) {
        case INFORMATION_MESSAGE_OK:
          return uiRouter.rootUIRoute().getUIMessage(uiRouter, {});
          break;
      }
      break;
  }

  return mainMenuFactory(20, 30, 123);
};

const /** @type UIRouteGetUIMessage */ getUIMessage = (uiRouter, args) => {
  if (!uiRouter.player) {
    return uiRouter.newplayerUIRoute().getUIMessage(uiRouter, {});
  }
  // TODO: it depends...
  return uiRouter.mainmenuUIRoute().getUIMessage(uiRouter, {});
};

const /** @type UIRoute */ uiRoute = {
  route: new Route('/'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};