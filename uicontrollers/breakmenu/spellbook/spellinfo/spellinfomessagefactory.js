"use strict";

const UIMessage = require('../../../../models/uimessage/uimessage');
const breakTitleFactory = require('../../../_partials/breaktitlefactory');
const spellInfoFactory = require('../../../_partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Player} player
 * @param {Spell} spell
 * @return {UIMessage}
 */
function spellFactory(callback_id, channel, player, spell) {
  const spellUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callback_id, channel, player));

  uiAttachments.push(spellInfoFactory(spell, callback_id));

  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
    actions: [
      {
        name: "back",
        text: ":back:",
        type: "button",
        value: "back"
      }
    ]
  });
  spellUIMessage.setUIAttachments(uiAttachments);
  return spellUIMessage;
}

module.exports = spellFactory;