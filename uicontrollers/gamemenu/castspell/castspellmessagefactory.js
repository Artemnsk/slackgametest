"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');
const /** @type Array<Spell> */ spells = require('../../../storage/spells/spells');
const spellInfoFactory = require('../../_partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Game} game
 * @param {Gamer} gamer
 * @param {Spell} spell
 * @return {UIMessage}
 */
function castSpellFactory(callback_id, channel, game, gamer, spell) {
  const castSpellUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(gameTitleFactory(callback_id, gamer));
  uiAttachments.push(spellInfoFactory(spell, callback_id));
  let footerUIAttachments = {
    text: '',
    color: "#1E09C9",
    attachment_type: "default",
    callback_id: callback_id,
    actions: []
  };
  footerUIAttachments.actions.push({
    name: "back",
    text: ":back:",
    type: "button",
    value: "back"
  });
  let castSpellAction = spell.getCastForm(callback_id, game);
  if (castSpellAction) {
    footerUIAttachments.actions.push(castSpellAction);
  }
  uiAttachments.push(footerUIAttachments);
  castSpellUIMessage.setUIAttachments(uiAttachments);
  return castSpellUIMessage;
}

module.exports = castSpellFactory;