import { SpellFirebaseValue } from "./dbfirebase";

export const enum SPELLS {
  FIREBALL = "FIREBALL",
  ICE_LANCE = "ICE_LANCE",
}

// We cannot calculate enum length in runtime so we have to store this additional constant.
export const SPELLS_QUANTITY = 2;

export abstract class Spell {
  public abstract id: SPELLS;
  public abstract emoji: string;
  public abstract label: string;
  public abstract description: string;
  // Same as id.
  protected abstract $key: SPELLS;

  constructor(values: SpellFirebaseValue, itemKey: SPELLS) {
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

  public abstract getFirebaseValues(): SpellFirebaseValue;
}
