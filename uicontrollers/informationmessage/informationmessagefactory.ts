import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { UIMessage } from "../../models/uimessage/uimessage";

// That is used as name and value for "ok" button.
export const INFORMATION_MESSAGE_OK = "ok";

/**
 * Provides with information UI element.
 */
export function informationMessageFactory(callbackId: string, text: string, buttonText: string) {
  const informationMessageUIMessage = new UIMessage();
  const uiAttachments: SlackMessageAttachment[] = [];
  uiAttachments.push({
    actions: [
      {
        name: INFORMATION_MESSAGE_OK,
        text: buttonText,
        type: "button",
        value: INFORMATION_MESSAGE_OK,
      },
    ],
    attachment_type: "default",
    callback_id: callbackId,
    color: "#3AA3E3",
    text,
  });
  informationMessageUIMessage.setUIAttachments(uiAttachments);
  return informationMessageUIMessage;
}
