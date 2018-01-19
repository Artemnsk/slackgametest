import { SpellFirebaseValue } from "./dbfirebase";
import { Gamer } from "../gamer/gamer";

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
  public power: number;
  // Same as id.
  protected abstract $key: SPELLS;
  private gamer: Gamer;

  constructor(gamer: Gamer, values: SpellFirebaseValue, itemKey: SPELLS) {
    this.gamer = gamer;
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

  public getKey(): string {
    return this.$key;
  }

  public abstract getFirebaseValues(): SpellFirebaseValue;
}
