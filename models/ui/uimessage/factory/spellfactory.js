"use strict";

const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');
const spells = require('../../../../storage/spells/spells');
const spellInfoFactory = require('./partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @param {Spell} spell
 * @return {UIMessage}
 */
function spellFactory(spell) {
  const spellUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(1, 2, 3));

  uiAttachments.push(spellInfoFactory(spell, "/breakmenu/spellbook/"  + spell.id));

  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/breakmenu/spellbook/"  + spell.id,
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