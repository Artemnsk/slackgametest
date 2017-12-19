"use strict";

const Route = require('route-parser');
const informationMessageFactory = require('../uimessage/factory/informationmessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @return {UIMessage|Promise<UIMessage, Error>}
 */
function processActions(uiRouter, parsedPayload) {
  // TODO: that is actually bad.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'ok':
      switch (action.value) {
        case 'ok':
          return uiRouter.rootUIRoute().getUIMessage(uiRouter, {});
          break;
      }
      break;
  }
  // Anyway return root if no match.
  return uiRouter.rootUIRoute().getUIMessage(uiRouter, {});
}

/**
 * @param {UIRouter} uiRouter
 * @param {{text: string}} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  return informationMessageFactory(args.text, '/informationmessage', 'ok', 'ok');
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/informationmessage'),
  processActions,
  getUIMessage
};


module.exports = {
  uiRoute
};