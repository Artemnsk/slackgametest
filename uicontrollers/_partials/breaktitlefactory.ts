import * as moment from "moment";
import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { Channel } from "../../models/channel/channel";
import { Player } from "../../models/player/player";
const daySizeMs = 24 * 60 * 60 * 1000;

export function breakTitleFactory(callbackId: string, channel: Channel, player: Player): SlackMessageAttachment {
  const nextGameInfo = channel.nextGame ? `Next game in ${_getNextGameTime(channel.nextGame)}` : "";
  return {
    attachment_type: "default",
    callback_id: callbackId,
    color: "#950001",
    text: `:moneybag:${player.gold} ${nextGameInfo}`,
  };
}

function _getNextGameTime(timestampMs: number): string {
  const difference = timestampMs - Date.now();
  if (difference < 0) {
    return "..now!";
  } else if (difference > daySizeMs) {
    return "> 1 day";
  } else {
    const date = moment(difference).utc(false);
    return date.format("H:mm:ss");
  }
}
