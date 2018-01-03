import {SlackMessageAction, SlackMessageAttachment} from "../../../helpers/slackmessage";
import { Channel } from "../../../models/channel/channel";
import { Player } from "../../../models/player/player";
import { UIMessage } from "../../../models/uimessage/uimessage";
import { spells } from "../../../storage/spells/spells";
import { breakTitleFactory } from "../../_partials/breaktitlefactory";

function _getSpells(callbackId: string): SlackMessageAttachment {
  const attachment: SlackMessageAttachment = {
    actions: [],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#a333a1",
  };
  const actions: SlackMessageAction[] = [];
  for (let i = 0; i < spells.length; i++) {
    actions.push({
      name: "spell",
      text: spells[i].emoji,
      type: "button",
      value: spells[i].id,
    });
  }
  if (actions.length > 0) {
    attachment.text = "*Spells*";
    attachment.actions = actions;
  } else {
    attachment.text = "*No spells available*";
  }
  return attachment;
}

/**
 * Provides with spellbook UI element.
 */
export function spellBookMessageFactory(callbackId: string, channel: Channel, player: Player): UIMessage {
  const spellBookUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  uiAttachments.push(breakTitleFactory(callbackId, channel, player));
  uiAttachments.push(_getSpells(callbackId));
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
  spellBookUIMessage.setUIAttachments(uiAttachments);
  return spellBookUIMessage;
}
