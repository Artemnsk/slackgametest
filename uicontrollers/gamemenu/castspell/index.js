"use strict";

const Route = require('route-parser');
const CHANNEL_PHASES = require('../../../models/channel/channel').CHANNEL_PHASES;
const /** @type Array<Spell> */ spells = require('../../../storage/spells/spells');
const castSpellFactory = require('./castspellmessagefactory');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{ spellId: string }} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
    return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
  } else if (!uiRouter.gamer) {
    // TODO: something else if you have no gamer.
  }
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // Delegate that to spell now.
  const spell = spells.find(item => item.id === args.spellId);
  let spellBeingProcessedPromise = spell.processCastForm(uiRouter.game, parsedPayload);
  return spellBeingProcessedPromise
    .then((processed) => {
      if (processed) {
        return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      } else {
        // ..proceed with other checks. Currently no other checks.
        // TODO: error?
        return null;
      }
    }, (err) => {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: `Error: Something went wrong. ${err.message}` });
    });
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{ spellId: string }} args
 * @return {Promise<UIMessage,Error>}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: Cannot find your player.' });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
    return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
  } else if (!uiRouter.gamer) {
    // TODO: something else if you have no gamer.
  }
  const spell = spells.find(item => item.id === args.spellId);
  if (spell) {
    return Promise.resolve(castSpellFactory(uiRouter.castspellUIRoute.route.reverse(args), uiRouter.channel, uiRouter.game, uiRouter.gamer, spell));
  } else {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: 'Error: spell not found.' });
  }
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu/castspell/:spellId'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};