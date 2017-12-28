"use strict";

const Route = require('route-parser');
const spellInfoMessageFactory = require('./spellinfomessagefactory');
const /** @type Array<Spell> */ spells = require('../../../../storage/spells/spells');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise<UIMessage,Error>}
 */
function processActions(uiRouter, parsedPayload, args) {
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
  const spell = spells.find(item => item.id === args.spellId);
  if (spell) {
    let uiMessage = spellInfoMessageFactory(uiRouter.spellinfoUIRoute.route.reverse({ spellName: spell.id }), uiRouter.channel, uiRouter.player, spell);
    return Promise.resolve(uiMessage);
  }
  let text = "Spell not found.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
}

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

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/spellbook/:spellName'),
  processActions,
  getUIMessage,
  validateRoute
};

module.exports = {
  uiRoute
};