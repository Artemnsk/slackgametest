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

  public abstract getFirebaseValues(): ItemFirebaseValue;
}
