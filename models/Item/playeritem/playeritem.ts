import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";
import { Player } from "../../player/player";

export abstract class PlayerItem extends Item {
  private player: Player;

  constructor(player: Player, values: ItemFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.player = player;
  }

  public getTeamKey(): string {
    return this.player.getTeamKey();
  }

  public getChannelKey() {
    return this.player.getChannelKey();
  }

  public abstract getFirebaseValues(): ItemFirebaseValue;
}
