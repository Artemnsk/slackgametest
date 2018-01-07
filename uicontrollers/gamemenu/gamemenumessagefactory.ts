import { SlackMessageActionButton, SlackMessageAttachment } from "../../helpers/slackmessage";
import { Gamer } from "../../models/gamer/gamer";
import { UIMessage } from "../../models/uimessage/uimessage";
import { gameTitleFactory } from "../_partials/gametitlefactory";

/**
 * Provides with game menu UI element.
 */
export function gameMenuMessageFactory(callbackId: string, gamer: Gamer|null): UIMessage {
  const gameMenuUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  const gamerSpellActions = _getSpellActions(callbackId, gamer);
  const gamerItemActions = _getItemActions(callbackId, gamer);
  const gamerActions = gamerSpellActions.concat(gamerItemActions);
  const gamerActionsAttachment: SlackMessageAttachment = {
    actions: gamerActions,
    attachment_type: "default",
    callback_id: callbackId,
    color: "#a333a1",
    text: gamerActions.length > 0 ? "*Available actions*" : "*Nothing to use*",
  };
  if (!gamer) {
    // Non-gamer menu.
    uiAttachments.push(gameTitleFactory(callbackId, gamer));
  } else {
    // Both Dead gamer menu and Default game menu.
    uiAttachments.push(gameTitleFactory(callbackId, gamer));
    uiAttachments.push(gamerActionsAttachment);
  }
  const bottomMenu: SlackMessageAttachment = {
    actions: [{
      name: "navigation",
      text: ":man-woman-girl-boy: Stats",
      type: "button",
      value: "stats",
    }],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#950001",
    text: "",
  };
  uiAttachments.push(bottomMenu);
  gameMenuUIMessage.setUIAttachments(uiAttachments);
  return gameMenuUIMessage;
}

function _getSpellActions(callbackId: string, gamer: Gamer|null): SlackMessageActionButton[] {
  if (gamer !== null) {
    return gamer.spells.map((spell) => {
      const button: SlackMessageActionButton = {
        name: "spell",
        text: spell.emoji,
        type: "button",
        value: spell.$key,
      };
      return button;
    });
  } else {
    return [];
  }
}

function _getItemActions(callbackId: string, gamer: Gamer|null): SlackMessageActionButton[] {
  if (gamer !== null) {
    return gamer.items.map((item) => {
      const button: SlackMessageActionButton = {
        name: "item",
        text: item.emoji,
        type: "button",
        value: item.$key,
      };
      return button;
    });
  } else {
    return [];
  }
}
