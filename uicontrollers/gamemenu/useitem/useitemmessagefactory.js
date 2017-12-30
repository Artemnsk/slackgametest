"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');
const /** @type Array<Spell> */ spells = require('../../../storage/spells/spells');
const itemInfoFactory = require('../../_partials/iteminfofactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Channel} channel
 * @param {Game} game
 * @param {Gamer} gamer
 * @param {Item} item
 * @return {UIMessage}
 */
function useItemMessageFactory(callback_id, channel, game, gamer, item) {
  const useItemUIMessage = new UIMessage();
  let uiAttachments = [];
  uiAttachments.push(gameTitleFactory(callback_id, gamer));
  uiAttachments.push(itemInfoFactory(item, callback_id));
  // TODO: delegate that to validator?
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
    let validateItem = item.validateGamerUsage(gamer);
    let footerUIAttachments = {
      text: validateItem === true ? '' : validateItem,
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
    let useItemAction = item.getUsageForm(callback_id, game, gamer);
    if (useItemAction) {
      footerUIAttachments.actions.push(useItemAction);
    }
    uiAttachments.push(footerUIAttachments);
  }
  useItemUIMessage.setUIAttachments(uiAttachments);
  return useItemUIMessage;
}

module.exports = useItemMessageFactory;