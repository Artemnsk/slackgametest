import { Gamer } from "../../gamer/gamer";
import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";

export abstract class GamerItem extends Item {
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
}
