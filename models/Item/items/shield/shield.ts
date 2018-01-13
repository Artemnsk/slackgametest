import { ITEMS } from "../../item";
import { UsableItem } from "../../usableitem";
import { ItemShieldFirebaseValue } from "./dbfirebase";

export class ItemShield extends UsableItem {
  public id: ITEMS = ITEMS.SHIELD;
  public emoji: string = ":shield:";
  public label: string = "Steel shield";
  public description: string = "This is simple steel shield. Nothing special.";
  public armor: number;

  constructor(values: ItemShieldFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.armor = values.armor;
  }

  public getFirebaseValues(): ItemShieldFirebaseValue {
    return {
      // todo:
      armor: this.armor,
      description: this.description,
      emoji: this.emoji,
      id: ITEMS.SHIELD,
      label: this.label,
    };
  }
}
