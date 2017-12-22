"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const statsTitleFactory = require('../../_partials/statstitlefactory');
const spells = require('../../../storage/spells/spells');

function _getSpells() {
  let attachment = {
    color: "#a333a1",
    callback_id: '/breakmenu/spellbook',
    attachment_type: "default"
  };
  var actions = [];
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
 * @return {UIMessage}
 */
function spellBookFactory(hp, mana, gold) {
  const spellBookUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(statsTitleFactory(hp, mana, gold));
  uiAttachments.push(_getSpells());
  uiAttachments.push({
    text: '',
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id: "/breakmenu/spellbook",
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