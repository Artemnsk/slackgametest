import { ITEMS } from "../../item";
import { ItemDaggerFirebaseValue } from "./dbfirebase";
import { UsablePlayerItem } from "../../playeritem/usableplayeritem";
import { Player } from "../../../player/player";

export class PlayerItemDagger extends UsablePlayerItem {
  public id: ITEMS = ITEMS.DAGGER;
  public emoji: string = ":dagger_knife:";
  public label: string = "Steel Dagger";
  public description: string = "This is simple steel dagger. Nothing special.";
  public power: number;

  constructor(player: Player, values: ItemDaggerFirebaseValue, itemKey: string) {
    super(player, values, itemKey);
    this.power = values.power;
  }

  public getFirebaseValues(): ItemDaggerFirebaseValue {
    return {
      // todo:
      power: this.power,
      description: this.description,
      emoji: this.emoji,
      id: ITEMS.DAGGER,
      label: this.label,
    };
  }
}
