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

  public getChannelKey() {
    return this.gamer.getChannelKey();
  }

  public getGameKey() {
    return this.gamer.getGameKey();
  }

  public getGamerKey() {
    return this.gamer.getKey();
  }

  public abstract getFirebaseValues(): ItemFirebaseValue;
}
