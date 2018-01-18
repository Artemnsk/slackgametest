import { SlackMessageActionButton, SlackMessageAttachment } from "../../../helpers/slackmessage";
import { Channel } from "../../../models/channel/channel";
import { Game } from "../../../models/game/game";
import { Gamer } from "../../../models/gamer/gamer";
import { IUsableInGame } from "../../../models/interfaces/iusable/iusable";
import { UIMessage } from "../../../models/uimessage/uimessage";
import { gameTitleFactory } from "../../_partials/gametitlefactory";

/**
 * Provides with spell UI element.
 */
export function castSpellMessageFactory(callbackId: string, channel: Channel, game: Game, gamer: Gamer, spell: IUsableInGame): UIMessage {
  const castSpellUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [ gameTitleFactory(callbackId, gamer), ...spell.getSlackInfo(callbackId) ];
  if (gamer.dead === true) {
    const footerUIAttachments: SlackMessageAttachment = {
      actions: [{
        name: "back",
        text: ":back:",
        type: "button",
        value: "back",
      }],
      attachment_type: "default",
      callback_id: callbackId,
      color: "#1E09C9",
      text: "",
    };
    uiAttachments.push(footerUIAttachments);
  } else {
    const validateSpell = spell.validateGamerUsage(gamer);
    const footerUIAttachments: SlackMessageAttachment = {
      attachment_type: "default",
      callback_id: callbackId,
      color: "#1E09C9",
      text: validateSpell === true ? "" : validateSpell,
    };
    const backButton: SlackMessageActionButton = {
      name: "back",
      text: ":back:",
      type: "button",
      value: "back",
    };
    footerUIAttachments.actions = [ backButton ];
    const castSpellAction = spell.getUsageForm(callbackId, game, gamer);
    if (castSpellAction) {
      footerUIAttachments.actions.push(castSpellAction);
    }
    uiAttachments.push(footerUIAttachments);
  }
  castSpellUIMessage.setUIAttachments(uiAttachments);
  return castSpellUIMessage;
}
