import { ITEMS } from "../../item";
import { ItemShieldFirebaseValue } from "./dbfirebase";
import { UsablePlayerItem } from "../../playeritem/usableplayeritem";
import { Player } from "../../../player/player";

export class PlayerItemShield extends UsablePlayerItem {
  public id: ITEMS = ITEMS.SHIELD;
  public emoji: string = ":shield:";
  public label: string = "Steel shield";
  public description: string = "This is simple steel shield. Nothing special.";
  public armor: number;

  constructor(player: Player, values: ItemShieldFirebaseValue, itemKey: string) {
    super(player, values, itemKey);
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
