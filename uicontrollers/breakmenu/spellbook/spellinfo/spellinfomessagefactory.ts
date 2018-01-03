import { Channel } from "../../../../models/channel/channel";
import { Player } from "../../../../models/player/player";
import { Spell } from "../../../../models/spell/spell";
import { UIMessage } from "../../../../models/uimessage/uimessage";
import { breakTitleFactory } from "../../../_partials/breaktitlefactory";

/**
 * Provides with spell UI element.
 */
export function spellInfoMessageFactory(callbackId: string, channel: Channel, player: Player, spell: Spell): UIMessage {
  const spellUIMessage = new UIMessage();
  let /** @type Array<SlackMessageAttachment> */ uiAttachments = [];
  uiAttachments.push(breakTitleFactory(callbackId, channel, player));
  uiAttachments = uiAttachments.concat(spell.getSlackInfo(callbackId));
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
    text: "",
  });
  spellUIMessage.setUIAttachments(uiAttachments);
  return spellUIMessage;
}
