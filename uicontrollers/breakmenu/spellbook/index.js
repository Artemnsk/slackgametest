"use strict";

const Route = require('route-parser');
const spellbookMessageFactory = require('./spellbookmessagefactory');
const CHANNEL_PHASES = require('../../../models/channel/channel').CHANNEL_PHASES;

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
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'spell':
      return uiRouter.spellinfoUIRoute.getUIMessage(uiRouter, { spellId: action.value });
      break;
    case 'back':
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // TODO: error?
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
  }
  let uiMessage = spellbookMessageFactory(uiRouter.spellbookUIRoute.route.reverse({}), uiRouter.channel, uiRouter.player);
  return Promise.resolve(uiMessage);
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/spellbook'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};