"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');
const /** @type Array<Spell> */ spells = require('../../../storage/spells/spells');
const spellInfoFactory = require('../../_partials/spellinfofactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Gamer} gamer
 * @param {Spell} spell
 * @return {UIMessage}
 */
function castSpellFactory(callback_id, channel, gamer, spell) {
  const castSpellUIMessage = new UIMessage();
  let uiAttachments = [];

  uiAttachments.push(gameTitleFactory(callback_id, gamer));

  uiAttachments.push(spellInfoFactory(spell, callback_id));

  // uiAttachments.push({
  //   text: '',
  //   color: "#1E09C9",
  //   attachment_type: "default",
  //   callback_id: "/gamemenu",
  //   actions: [
  //     {
  //       name: "target",
  //       text: "Target",
  //       type: "select",
  //       options: [{
  //         text: 'user 1',
  //         value: 'user1'
  //       }, {
  //         text: 'user 2',
  //         value: 'user2'
  //       }, {
  //         text: 'user 3',
  //         value: 'user3'
  //       }],
  //       selected_options: [{
  //         text: 'user 2',
  //         value: 'user2'
  //       }]
  //     }
  //   ]
  // });

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

  castSpellUIMessage.setUIAttachments(uiAttachments);
  return castSpellUIMessage;
}

module.exports = castSpellFactory;