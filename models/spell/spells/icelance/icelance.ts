import { SPELLS } from "../../spell";
import { UsableSpell } from "../../usablespell";
import { SpellIceLanceFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";

export class SpellIceLance extends UsableSpell {
  public id: SPELLS = SPELLS.ICE_LANCE;
  public emoji: string = ":comet:";
  public label: string = "Ice Lance";
  public description: string = "Send ice lance to enemy.";
  public damage: number;
  protected $key: SPELLS = SPELLS.ICE_LANCE;

  constructor(gamer: Gamer, values: SpellIceLanceFirebaseValue, itemKey: SPELLS) {
    super(gamer, values, itemKey);
    this.damage = values.damage;
  }

  public getFirebaseValues(): SpellIceLanceFirebaseValue {
    return {
      // todo:
      damage: this.damage,
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.ICE_LANCE,
      label: this.label,
    };
  }
}
