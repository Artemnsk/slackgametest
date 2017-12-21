"use strict";

const Route = require('route-parser');
const spellFactory = require('../uimessage/factory/spellfactory');
const spells = require('../../../storage/spells/spells');

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {UIMessage}
 */
function processActions(uiRouter, parsedPayload, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  // Parse submitted actions to know which window to render.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'back':
      return uiRouter.spellbookUIRoute().getUIMessage(uiRouter, {});
      break;
  }
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{spellId: string}} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  if (!uiRouter.player) {
    let text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
  }
  const spell = spells.find(item => item.id === args.spellId);
  if (spell) {
    return spellFactory(spell);
  }
  let text = "Spell not found.";
  return uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/breakmenu/spellbook/:spellName'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};