import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { UIMessage } from "../../models/uimessage/uimessage";

const CREATE_NEW_PLAYER_YES = "yes";

/**
 * Provides with new player UI element.
 */
export function newPlayerMessageFactory(callbackId: string): UIMessage {
  const newPlayerUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[]  = [];
  uiAttachments.push({
    actions: [
      {
        name: "option",
        text: "Create new player!",
        type: "button",
        value: CREATE_NEW_PLAYER_YES,
      },
    ],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#3AA3E3",
    text: "You have no player in this game yet. Do you want to create new one?",
  });
  newPlayerUIMessage.setUIAttachments(uiAttachments);
  return newPlayerUIMessage;
}
