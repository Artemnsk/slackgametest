"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const breakTitleFactory = require('../../_partials/breaktitlefactory');
const spells = require('../../../storage/spells/spells');

/**
 *
 * @param {string} callback_id
 * @return SlackMessageAttachment
 * @private
 */
function _getSpells(callback_id) {
  let /** @type SlackMessageAttachment */ attachment = {
    color: "#a333a1",
    callback_id,
    attachment_type: "default"
  };
  let actions = [];
  for (let i = 0; i < spells.length; i++) {
    actions.push({
      name: "spell",
      text: spells[i].emoji,
      type: "button",
      value: spells[i].id
    });
  }
  if (actions.length > 0) {
    attachment.text = "*Spells*";
    attachment.actions = actions;
  } else {
    attachment.text = "*No spells available*";
  }
  return attachment;
}

/**
 * Provides with spellbook UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Player} player
 * @return {UIMessage}
 */
function spellBookFactory(callback_id, channel, player) {
  const spellBookUIMessage = new UIMessage();
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callback_id, channel, player));
  uiAttachments.push(_getSpells(callback_id));
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
  spellBookUIMessage.setUIAttachments(uiAttachments);
  return spellBookUIMessage;
}

module.exports = spellBookFactory;