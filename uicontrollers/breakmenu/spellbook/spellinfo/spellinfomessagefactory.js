"use strict";

const UIMessage = require('../../../../models/uimessage/uimessage');
const breakTitleFactory = require('../../../_partials/breaktitlefactory');

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
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callback_id, channel, player));
  uiAttachments = uiAttachments.concat(spell.getSlackInfo(callback_id));
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