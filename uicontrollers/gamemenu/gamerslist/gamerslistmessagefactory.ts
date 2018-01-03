import { SlackMessageAttachment } from "../../../helpers/slackmessage";
import { Game } from "../../../models/game/game";
import { Gamer } from "../../../models/gamer/gamer";
import { UIMessage } from "../../../models/uimessage/uimessage";
import { gameTitleFactory } from "../../_partials/gametitlefactory";

/**
 * Provides with spell UI element.
 */
export function gamersListMessageFactory(callbackId: string, game: Game, gamer: Gamer|null): UIMessage {
  const gamersListUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  uiAttachments.push(gameTitleFactory(callbackId, gamer));
  const gamers: Gamer[] = [];
  for (const gamerKey in game.gamers) {
    if (game.gamers.hasOwnProperty(gamerKey)) {
      const currentGamer = game.getGamer(gamerKey);
      if (currentGamer !== null) {
        gamers.push(currentGamer);
      }
    }
  }
  gamers.sort((a, b) => a.dead && !b.dead ? 1 : -1);
  let gamersListText = "";
  gamers.map((item) => gamersListText += `${item.getGameStats()}\n`);
  // TODO: group them by 5 items per attachment. Otherwise we will have show more text.
  const gamersListUIAttachments: SlackMessageAttachment = {
    actions: [{
      name: "navigation",
      text: ":back:",
      type: "button",
      value: "back",
    }],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#1E09C9",
    mrkdwn_in: ["text"],
    text: gamersListText,
  };
  uiAttachments.push(gamersListUIAttachments);
  gamersListUIMessage.setUIAttachments(uiAttachments);
  return gamersListUIMessage;
}
