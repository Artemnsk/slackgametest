import {SlackMessageActionButton, SlackMessageAttachment} from "../../../helpers/slackmessage";
import { Channel } from "../../../models/channel/channel";
import { Game } from "../../../models/game/game";
import { Gamer } from "../../../models/gamer/gamer";
import { Item } from "../../../models/Item/item";
import { UIMessage } from "../../../models/uimessage/uimessage";
import { gameTitleFactory } from "../../_partials/gametitlefactory";

/**
 * Provides with spell UI element.
 */
export function useItemMessageFactory(callbackId: string, channel: Channel, game: Game, gamer: Gamer, item: Item): UIMessage {
  const useItemUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [ gameTitleFactory(callbackId, gamer), ...item.getSlackInfo(callbackId) ];
  // TODO: delegate that to validator?
  if (gamer.dead === true) {
    const footerUIAttachment: SlackMessageAttachment = {
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
    uiAttachments.push(footerUIAttachment);
  } else {
    const validateItem = item.validateGamerUsage(gamer);
    const footerUIAttachment: SlackMessageAttachment = {
      attachment_type: "default",
      callback_id: callbackId,
      color: "#1E09C9",
      text: validateItem === true ? "" : validateItem,
    };
    const backButton: SlackMessageActionButton = {
      name: "back",
      text: ":back:",
      type: "button",
      value: "back",
    };
    footerUIAttachment.actions = [ backButton ];
    const useItemAction = item.getUsageForm(callbackId, game, gamer);
    if (useItemAction) {
      footerUIAttachment.actions.push(useItemAction);
    }
    uiAttachments.push(footerUIAttachment);
  }
  useItemUIMessage.setUIAttachments(uiAttachments);
  return useItemUIMessage;
}
