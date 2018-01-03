import { SlackMessageAttachment } from "../../../helpers/slackmessage";
import { Channel } from "../../../models/channel/channel";
import { Player } from "../../../models/player/player";
import { UIMessage } from "../../../models/uimessage/uimessage";
import { breakTitleFactory } from "../../_partials/breaktitlefactory";

/**
 * Provides with shop UI element.
 */
export function shopMessageFactory(callbackId: string, channel: Channel, player: Player): UIMessage {
  const shopUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  uiAttachments.push(breakTitleFactory(callbackId, channel, player));
  uiAttachments.push({
    actions: [
      {
        name: "back",
        text: ":back:",
        type: "button",
        value: "back",
      },
    ],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#3AA3E3",
    text: "*Shop*",
  });
  shopUIMessage.setUIAttachments(uiAttachments);
  return shopUIMessage;
}
