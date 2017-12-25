"use strict";

const UIMessage = require('../../../../models/uimessage/uimessage');
const statsTitleFactory = require('../../../_partials/statstitlefactory');
const spellInfoFactory = require('../../../_partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Spell} spell
 * @return {UIMessage}
 */
function spellFactory(callback_id, spell) {
  const spellUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(1, 2, 3));

  uiAttachments.push(spellInfoFactory(spell, "/breakmenu/spellbook/"  + spell.id));

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