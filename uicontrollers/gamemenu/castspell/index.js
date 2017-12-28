"use strict";

const Route = require('route-parser');
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
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      break;
  }
  // Delegate that to spell now.
  const spell = spells.find(item => item.id === args.spellId);
  let spellBeingProcessedPromise = spell.processCastForm(uiRouter.game, uiRouter.gamer, parsedPayload);
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
  const spell = spells.find(item => item.id === args.spellId);
  return Promise.resolve(castSpellFactory(uiRouter.castspellUIRoute.route.reverse(args), uiRouter.channel, uiRouter.game, uiRouter.gamer, spell));
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {string} path
 * @param {ParsedSlackActionPayload} [parsedPayload]
 * @return ?UIMessage
 */
function validateRoute(uiRouter, path, parsedPayload) {
  let validateRoute = new Route('/gamemenu/castspell/:spellId/*');
  let args;
  if (args = validateRoute.match(path)) {
    if (!uiRouter.gamer) {
      let text = 'Error: You are not participate in this game.';
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    } else if (!spells.find(item => item.id === args.spellId)) {
      let text = "Error: spell with this spell ID doesn't exist.";
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    } else if (!uiRouter.gamer.spells || uiRouter.gamer.spells[args.spellId] !== true) {
      let text = 'Error: You have no this spell.';
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
  }
  return null;
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/gamemenu/castspell/:spellId'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};