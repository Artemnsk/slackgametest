"use strict";

const Route = require('route-parser');
const informationMessageFactory = require('./informationmessagefactory').informationMessageFactory;
const INFORMATION_MESSAGE_OK = require('./informationmessagefactory').INFORMATION_MESSAGE_OK;

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @return {Promise<UIMessage, Error>}
 */
function processActions(uiRouter, parsedPayload) {
  // TODO: that is actually bad.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case INFORMATION_MESSAGE_OK:
      switch (action.value) {
        case INFORMATION_MESSAGE_OK:
          return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
          break;
      }
      break;
  }
  // Anyway return root if no match.
  return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
}

/**
 * @param {UIRouter} uiRouter
 * @param {{text: string, buttonText: [string]}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  let buttonText = args.buttonText ? args.buttonText : 'Ok';
  let uiMessage = informationMessageFactory(uiRouter.informationMessageUIRoute.route.reverse({}), args.text, buttonText);
  return Promise.resolve(uiMessage);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/informationmessage'),
  processActions,
  getUIMessage,
  validateRoute
};

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


module.exports = {
  uiRoute
};