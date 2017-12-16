"use strict";

const UIMessage = require('../uimessage');
const statsTitleFactory = require('./partials/statstitlefactory');
const spells = require('../../../../storage/spells/spells');

/**
 * Provides with spell UI element.
 * @return {UIMessage}
 */
function spellFactory(hp, mana, gold, spell_id) {
  const spellUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mana, gold));

  // Get spell and display info.
  var spell;
  for (let i = 0; i < spells.length; i++) {
    if (spell_id == spells[i].id) {
      spell = spells[i];
    }
  }
  uiAttachments.push({
    author_name: `${spell.emoji}${spell.label}`,
    fields: spell.getInfo(),
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/mainmenu/spellbook/" + spell_id,
  });
  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/mainmenu/spellbook/"  + spell_id,
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