import { ITEMS } from "../../item";
import { UsableGamerItem } from "../../gameritem/usablegameritem";
import { ItemDaggerFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";

export class GamerItemDagger extends UsableGamerItem {
  public id: ITEMS = ITEMS.DAGGER;
  public emoji: string = ":dagger_knife:";
  public label: string = "Steel Dagger";
  public description: string = "This is simple steel dagger. Nothing special.";
  public damage: number;

  constructor(gamer: Gamer, values: ItemDaggerFirebaseValue, itemKey: string) {
    super(gamer, values, itemKey);
    this.damage = values.damage;
  }

  public getFirebaseValues(): ItemDaggerFirebaseValue {
    return {
      // todo:
      damage: this.damage,
      description: this.description,
      emoji: this.emoji,
      id: ITEMS.DAGGER,
      label: this.label,
    };
  }
}
