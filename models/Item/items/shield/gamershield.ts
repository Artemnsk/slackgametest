import { ITEMS } from "../../item";
import { UsableGamerItem } from "../../gameritem/usablegameritem";
import { ItemShieldFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";

export class GamerItemShield extends UsableGamerItem {
  public id: ITEMS = ITEMS.SHIELD;
  public emoji: string = ":shield:";
  public label: string = "Steel shield";
  public description: string = "This is simple steel shield. Nothing special.";
  public armor: number;

  constructor(gamer: Gamer, values: ItemShieldFirebaseValue, itemKey: string) {
    super(gamer, values, itemKey);
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
