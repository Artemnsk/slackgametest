import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { Channel } from "../../models/channel/channel";
import { Player } from "../../models/player/player";
import { UIMessage } from "../../models/uimessage/uimessage";
import { breakTitleFactory } from "../_partials/breaktitlefactory";

/**
 * Provides with main menu UI element.
 */
export function breakMenuMessageFactory(callbackId: string, channel: Channel, player: Player): UIMessage {
  const breakMenuUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  uiAttachments.push(breakTitleFactory(callbackId, channel, player));
  uiAttachments.push({
    actions: [
      {
        name: "shop",
        text: ":scales:Shop",
        type: "button",
        value: "shop",
      },
    ],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#3AA3E3",
    text: "",
  });
  breakMenuUIMessage.setUIAttachments(uiAttachments);
  return breakMenuUIMessage;
}
