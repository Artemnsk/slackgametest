"use strict";

const Route = require('route-parser');
const spellInfoMessageFactory = require('./spellinfomessagefactory');
const CHANNEL_PHASES = require('../../../../models/channel/channel').CHANNEL_PHASES;
const /** @type Array<Spell> */ spells = require('../../../../storage/spells/spells');

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
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{spellId: string}} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Invalid channel phase to use this menu.' });
  }
  const spell = spells.find(item => item.id === args.spellId);
  if (spell) {
    let uiMessage = spellInfoMessageFactory(uiRouter.spellinfoUIRoute.route.reverse({ spellName: spell.id }), uiRouter.channel, uiRouter.player, spell);
    return Promise.resolve(uiMessage);
  }
  let text = "Spell not found.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/spellbook/:spellName'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};