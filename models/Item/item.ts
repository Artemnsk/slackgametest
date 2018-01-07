import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { ItemFirebaseValue } from "./dbfirebase";
import {ItemDaggerFirebaseValue} from "./items/dagger/dbfirebase";

export const enum ITEMS {
  DAGGER = "DAGGER",
  SHIELD = "SHIELD",
}

export abstract class Item {
  public abstract id: ITEMS;
  public $key: string;
  public abstract emoji: string;
  public abstract label: string;
  public abstract description: string;

  constructor(values: ItemFirebaseValue, itemKey: string) {
    this.$key = itemKey;
    if (values.emoji !== undefined) {
      this.emoji = values.emoji;
    }
    if (values.label !== undefined) {
      this.label = values.label;
    }
    if (values.description !== undefined) {
      this.description = values.description;
    }
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

  public abstract getFirebaseValues(): ItemFirebaseValue;
}
