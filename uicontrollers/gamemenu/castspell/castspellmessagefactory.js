"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');
const spells = require('../../../storage/spells/spells');
const spellInfoFactory = require('../../_partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @return {UIMessage}
 */
function castSpellFactory(hp, mana, gold, spell_id) {
  const castSpellUIMessage = new UIMessage();
  let uiAttachments = [];
  // uiAttachments.push(statsTitleFactory(hp, mana, gold));

  // Get spell and display info.
  const spell = spells.find(item => item.id === spell_id);

  uiAttachments.push(spellInfoFactory(spell, "/breakmenu/spellbook/"  + spell_id));

  uiAttachments.push({
    text: '',
    color: "#1E09C9",
    attachment_type: "default",
    callback_id: "/gamemenu",
    actions: [
      {
        name: "target",
        text: "Target",
        type: "select",
        options: [{
          text: 'user 1',
          value: 'user1'
        }, {
          text: 'user 2',
          value: 'user2'
        }, {
          text: 'user 3',
          value: 'user3'
        }],
        selected_options: [{
          text: 'user 2',
          value: 'user2'
        }]
      }
    ]
  });
  castSpellUIMessage.setUIAttachments(uiAttachments);
  return castSpellUIMessage;
}

module.exports = castSpellFactory;