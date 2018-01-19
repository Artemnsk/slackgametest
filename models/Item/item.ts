import { SlackMessageAttachment } from "../../helpers/slackmessage";
import { IInspectable } from "../iusable/iusable";
import { ItemFirebaseValue } from "./dbfirebase";

export const enum ITEMS {
  DAGGER = "DAGGER",
  SHIELD = "SHIELD",
}

export abstract class Item implements IInspectable {
  public abstract id: ITEMS;
  public abstract emoji: string;
  public abstract label: string;
  public abstract description: string;
  protected $key: string;

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

  public getKey(): string {
    return this.$key;
  }

  public abstract getSlackInfo(callbackId: string): SlackMessageAttachment[];

  public abstract getFirebaseValues(): ItemFirebaseValue;
}
