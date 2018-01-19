import { GameAction } from "../../../gameaction/gameaction";
import { Gamer } from "../../../gamer/gamer";
import { GamerItem } from "../../gameritem/gameritem";
import { ITEMS } from "../../item";
import { ItemShieldFirebaseValue } from "./dbfirebase";

export class GamerItemShield extends GamerItem {
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

  public alterGameActionPhase(phase: string, gameAction: GameAction): GameAction[] {
    return [];
  }
}
