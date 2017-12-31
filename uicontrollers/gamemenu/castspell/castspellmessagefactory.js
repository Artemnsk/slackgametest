"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');

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
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(gameTitleFactory(callback_id, gamer));
  uiAttachments = uiAttachments.concat(spell.getSlackInfo(callback_id));
  if (gamer.dead === true) {
    let footerUIAttachments = {
      text: '',
      color: "#1E09C9",
      attachment_type: "default",
      callback_id: callback_id,
      actions: [{
        name: "back",
        text: ":back:",
        type: "button",
        value: "back"
      }]
    };
    uiAttachments.push(footerUIAttachments);
  } else {
    let validateSpell = spell.validateGamerCast(gamer);
    let footerUIAttachments = {
      text: validateSpell === true ? '' : validateSpell,
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
    let castSpellAction = spell.getCastForm(callback_id, game, gamer);
    if (castSpellAction) {
      footerUIAttachments.actions.push(castSpellAction);
    }
    uiAttachments.push(footerUIAttachments);
  }
  castSpellUIMessage.setUIAttachments(uiAttachments);
  return castSpellUIMessage;
}

module.exports = castSpellFactory;