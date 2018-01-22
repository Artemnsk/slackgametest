import { SlackMessageAttachment } from "../../../helpers/slackmessage";
import { GameAction } from "../../gameaction/gameaction";
import { Gamer } from "../../gamer/gamer";
import { IAlterableDefaultGameProcess, IAlterableGameActionMixedValues } from "../../iusable/ialterable";
import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";
import { MixedValue } from "../../mixed/mixedvalue/mixedvalue";

export abstract class GamerItem extends Item implements IAlterableGameActionMixedValues, IAlterableDefaultGameProcess {
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
  public alterGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string): void {
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

  public alterBeingUsedInGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string): GameAction[] {
    return [];
  }

  // Could be overridden by children to involve some additional logic on game processing step.
  // E.g. track ends of buffs/debuffs and so on.
  public alterDefaultGameProcess(): boolean {
    return false;
  }
}
