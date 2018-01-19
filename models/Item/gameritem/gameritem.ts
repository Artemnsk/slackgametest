import { Gamer } from "../../gamer/gamer";
import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";
import { IAlterableGameActionMixedValues } from "../../iusable/ialterable";
import { GameAction } from "../../gameaction/gameaction";
import { SlackMessageAttachment } from "../../../helpers/slackmessage";

export abstract class GamerItem extends Item implements IAlterableGameActionMixedValues {
  private gamer: Gamer;

  constructor(gamer: Gamer, values: ItemFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.gamer = gamer;
  }

  public getTeamKey(): string {
    return this.gamer.getTeamKey();
  }

  public getChannelKey(): string {
    return this.gamer.getChannelKey();
  }

  public getGameKey(): string {
    return this.gamer.getGameKey();
  }

  public getGamerKey(): string {
    return this.gamer.getKey();
  }

  // TODO: gamer item fb value.
  public abstract getFirebaseValues(): ItemFirebaseValue;

  // TODO: abstract?
  public alterGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string): void {
    //
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

  // TODO: abstract?
  public alterBeingUsedInGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string): GameAction[] {
    return [];
  }
}
