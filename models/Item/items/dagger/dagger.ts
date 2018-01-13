import { ITEMS } from "../../item";
import { UsableItem } from "../../usableitem";
import { ItemDaggerFirebaseValue } from "./dbfirebase";

export class ItemDagger extends UsableItem {
  public id: ITEMS = ITEMS.DAGGER;
  public emoji: string = ":dagger_knife:";
  public label: string = "Steel Dagger";
  public description: string = "This is simple steel dagger. Nothing special.";
  public damage: number;

  constructor(values: ItemDaggerFirebaseValue, itemKey: string) {
    super(values, itemKey);
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
