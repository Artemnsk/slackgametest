import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";
import { Player } from "../../player/player";
import { SlackMessageAttachment } from "../../../helpers/slackmessage";

export abstract class PlayerItem extends Item {
  private player: Player;

  constructor(player: Player, values: ItemFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.player = player;
  }

  public getTeamKey(): string {
    return this.player.getTeamKey();
  }

  public getChannelKey(): string {
    return this.player.getChannelKey();
  }

  /**
   * Responds with array of attachments to display item info in Slack app message.
   */
  public getSlackInfo(callbackId: string): SlackMessageAttachment[] {
    return [{
      attachment_type: "default",
      author_name: `${this.emoji}${this.label}`,
      callback_id: callbackId,
      color: "#3AA3E3",
      fields: [
        {
          short: false,
          title: "Description",
          value: this.description,
        },
      ],
    }];
  }

  // TODO: player item fb value.
  public abstract getFirebaseValues(): ItemFirebaseValue;
}
