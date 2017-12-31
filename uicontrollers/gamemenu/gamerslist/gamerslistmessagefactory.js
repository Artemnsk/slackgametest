"use strict";

const UIMessage = require('../../../models/uimessage/uimessage');
const gameTitleFactory = require('../../_partials/gametitlefactory');

/**
 * Provides with spell UI element.
 * @param {string} callback_id
 * @param {Game} game
 * @param {?Gamer} gamer
 * @return {UIMessage}
 */
function gamersListMessageFactory(callback_id, game, gamer) {
  const gamersListUIMessage = new UIMessage();
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(gameTitleFactory(callback_id, gamer));
  let /** @type Array<Gamer> */ gamers = [];
  for (let gamerKey in game.gamers) {
    let currentGamer = game.getGamer(gamerKey);
    gamers.push(currentGamer);
  }
  gamers.sort((a, b) => a.dead && !b.dead ? 1 : -1);
  let gamersListText = '';
  gamers.map(item => gamersListText += item.getGameStats() + '\n');
  // TODO: group them by 5 items per attachment. Otherwise we will have show more text.
  let gamersListUIAttachments = {
    text: gamersListText,
    mrkdwn_in: ["text"],
    color: "#1E09C9",
    attachment_type: "default",
    callback_id: callback_id,
    actions: []
  };
  gamersListUIAttachments.actions.push({
    name: "navigation",
    text: ":back:",
    type: "button",
    value: "back"
  });
  uiAttachments.push(gamersListUIAttachments);
  gamersListUIMessage.setUIAttachments(uiAttachments);
  return gamersListUIMessage;
}

module.exports = gamersListMessageFactory;