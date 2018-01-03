import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { Gamer } from "../../models/gamer/gamer";

export function gameTitleFactory(callbackId: string, gamer: Gamer|null): SlackMessageAttachment {
  if (!gamer) {
    return {
      attachment_type: "default",
      callback_id: callbackId,
      color: "#950001",
      text: `you're not participate in this game`,
    };
  } else if (gamer.dead === true) {
    return {
      attachment_type: "default",
      callback_id: callbackId,
      color: "#950001",
      text: `you're dead`,
    };
  } else {
    return {
      attachment_type: "default",
      callback_id: callbackId,
      color: "#950001",
      text: `:heart:${gamer.health} :large_blue_diamond:${gamer.mana}`,
    };
  }
}
